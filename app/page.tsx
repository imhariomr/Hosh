"use client";

import Button from "@/components/ui/button";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Eye, EyeClosed, EyeOff, Trash } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
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

  const deleteAddress = (index:number)=>{
    const data = localStorage.getItem('wallets');

    if(!data){
      return;
    }
    let addresses = JSON.parse(data) as string[];
    addresses.splice(index, 1);
    setWallets(addresses  );
    localStorage.setItem("wallets", JSON.stringify(addresses));
  }

  return (
    <div className="wrapper p-4">
      <h1 className="text-3xl font-bold mb-4">Generate Solana Wallets</h1>

      <Button
        label="Generate Wallet"
        size="md"
        variant="primary"
        onClick={generateWallet}
      />

      {mnemonic && (
        <div className="mt-4 p-3 rounded bg-gray-100">
          <p>
            <strong>Seed Phrase:</strong> {mnemonic}
          </p>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-4 space-y-3">
          {wallets.map((w, i) => (
            <div key={i} className="p-3 border rounded bg-gray-50 flex justify-between">
              <div>
                <p>
                  <strong>Public Key:</strong> {w.publicKey}
                </p>
                <p className="break-all">
                  <strong>Private Key:</strong>{" "}
                  {w.showPrivate ? w.privateKey : "••••••••••••••••"}
                </p>
              </div>
              <div className="flex flex-col justify-between">
                <button className="mt-2" onClick={() => deleteAddress(i)}>
                  {<Trash size={16} />}
                </button>
                <button className="mt-2" onClick={() => togglePrivateKey(i)}>
                  {w.showPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
