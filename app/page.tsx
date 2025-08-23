"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Eye, EyeClosed, EyeOff, Trash } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { setTheme } = useTheme();
  const [wallets, setWallets] = useState<any[]>([]);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  useEffect(() => {
    const savedMnemonic = localStorage.getItem("mnemonic");
    const savedWallets = localStorage.getItem("wallets");

    if (savedMnemonic) setMnemonic(savedMnemonic);
    if (savedWallets) setWallets(JSON.parse(savedWallets));
  }, []);

  const generateWallet = () => {
    let currentMnemonic = mnemonic;

    if (!currentMnemonic) {
      currentMnemonic = bip39.generateMnemonic();
      setMnemonic(currentMnemonic);
      localStorage.setItem("mnemonic", currentMnemonic);
    }

    const seed = bip39.mnemonicToSeedSync(currentMnemonic);
    const index = wallets.length;
    const path = `m/44'/501'/${index}'/0'`;

    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    const privateKey = Buffer.from(keypair.secretKey).toString("hex");

    const newWallet = {
      path,
      publicKey: keypair.publicKey.toBase58(),
      privateKey,
      showPrivate: false,
    };

    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
  };

  const togglePrivateKey = (index: number) => {
    const updated = [...wallets];
    updated[index].showPrivate = !updated[index].showPrivate;
    setWallets(updated);
    localStorage.setItem("wallets", JSON.stringify(updated));
  };

  const deleteAddress = (index: number) => {
    const data = localStorage.getItem("wallets");

    if (!data) {
      return;
    }
    let addresses = JSON.parse(data) as string[];
    addresses.splice(index, 1);
    setWallets(addresses);
    localStorage.setItem("wallets", JSON.stringify(addresses));
  };

  return (
    <div className="wrapper p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Generate Solana Wallets</h1>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Button size="lg" onClick={generateWallet}>
        Generate Wallet
      </Button>

      {mnemonic && (
        <div className="mt-4 p-3 rounded">
          <p>
            <strong>Seed Phrase:</strong> {mnemonic}
          </p>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-4 space-y-3">
          {wallets.map((w, i) => (
            <div
              key={i}
              className="p-3 border rounded flex flex-col sm:flex-row sm:justify-between border-box break-words overflow-hidden"
            >
              <div className="min-w-0 space-y-2">
                <p className="break-all">
                  <strong>Public Key:</strong> {w.publicKey}
                </p>
                <p className="break-all">
                  <strong>Private Key:</strong>{" "}
                  {w.showPrivate
                    ? w.privateKey
                    : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-between sm:ml-4 mt-2 sm:mt-0 space-y-2">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button size="icon">
                      <Trash size={10} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteAddress(i)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button size="icon" onClick={() => togglePrivateKey(i)}>
                  {w.showPrivate ? <EyeOff size={10} /> : <Eye size={10} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
