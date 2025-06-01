// src/App.tsx
import { useEffect, useState } from "react";
import { ethers, Eip1193Provider, Contract } from "ethers";
import MyTokenABI from "./abis/MyToken.json";
import PermitSpenderABI from "./abis/PermitSpender.json";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

const MYTOKEN_ADDRESS = "0x01bddfd7a8ad971604c278336868edc59018ab57";
const PERMITSPENDER_ADDRESS = "0x902d462592a61f985bba51d2ef899102d1fc3abf";

const Spinner = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      ></path>
    </svg>
  );
};

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [token, setToken] = useState<ethers.Contract | null>(null);
  const [spender, setSpender] = useState<ethers.Contract | null>(null);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isPermit, setIsPermit] = useState<boolean>(false);

  useEffect(() => {
    const initValues = async () => {
      if (!window.ethereum) return;
      const p = new ethers.BrowserProvider(window.ethereum);

      setProvider(p);
      const signer = await p.getSigner();
      setSigner(signer);
      const myAccount = await signer.getAddress();
      setAccount(myAccount);
      const tokenMTP = new Contract(
        ethers.getAddress(MYTOKEN_ADDRESS),
        MyTokenABI,
        signer
      );
      setToken(tokenMTP);
      const protocolWithPermit = new Contract(
        ethers.getAddress(PERMITSPENDER_ADDRESS),
        PermitSpenderABI,
        signer
      );
      setSpender(protocolWithPermit);
    };

    initValues();
  }, []);

  async function handleMint() {
    if (!token) return;
    setIsMinting(true);
    const tx = await token.mint();
    await tx.wait();
    setIsMinting(false);
    alert("Tokens minted");
  }

  async function handlePermitAndTransfer() {
    setIsPermit(true);
    if (!signer || !token || !spender || !account || !provider) return;

    const to = prompt("Receiver address:");
    if (!to) return;

    const amount = ethers.parseEther("1"); // 1 token
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const nonce = await token.nonces(account);
    const name = await token.name();
    const version = "1";
    const { chainId } = await provider.getNetwork();

    const domain = {
      name,
      version,
      chainId: Number(chainId),
      verifyingContract: MYTOKEN_ADDRESS,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const values = {
      owner: account,
      spender: PERMITSPENDER_ADDRESS,
      value: amount,
      nonce,
      deadline,
    };

    const sig = await signer.signTypedData(domain, types, values);
    const { v, r, s } = ethers.Signature.from(sig);

    const tx = await spender.permitAndTransferFrom(
      to,
      amount,
      deadline,
      v,
      r,
      s
    );
    await tx.wait();
    alert("Transfer successful");
    setIsPermit(false);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">ERC-2612 Demo (Rootstock)</h1>
      <p>Connected wallet: {account}</p>
      <div className="space-x-5">
        <button
          className="bg-blue-600 text-white p-2 rounded inline-flex items-center gap-2"
          onClick={handleMint}
          disabled={isMinting}
        >
          {isMinting && <Spinner />}
          Mint 5 Tokens
        </button>
        <button
          className="bg-green-600 text-white p-2 rounded inline-flex items-center gap-2"
          onClick={handlePermitAndTransfer}
          disabled={isPermit}
        >
          {isPermit && <Spinner />}
          Permit + TransferFrom
        </button>
      </div>
    </main>
  );
}
