import {
	Account,
	type BlockTxTuple,
	GlittrSDK,
	txBuilder,
} from "@glittr-sdk/sdk";
import { useState } from "react";
import UploadComponent from "./UploadComponent";

const NETWORK = "regtest";

const client = new GlittrSDK({
	network: NETWORK,
	electrumApi: "https://8c5d-58-11-42-217.ngrok-free.app",
	glittrApi: " https://11db-58-11-42-217.ngrok-free.app",
	// electrumApi: "https://hackathon-electrum.glittr.fi",
	// glittrApi: "https://hackathon-core-api.glittr.fi",
});

function App() {
	const [loading, setLoading] = useState(false);
	const [txId, setTxId] = useState<string>("");

	async function createFreeMintContract() {
		try {
			setLoading(true);

			const account = new Account({
				wif: "cW84FgWG9U1MpKvdzZMv4JZKLSU7iFAzMmXjkGvGUvh5WvhrEASj",
				network: NETWORK,
			});

			const c = txBuilder.freeMintContractInstantiate({
				simple_asset: {
					supply_cap: 200n.toString(),
					divisibility: 18,
					live_time: 0,
				},
				amount_per_mint: 2n.toString(),
			});

			const txid = await client.createAndBroadcastTx({
				account: account.p2pkh(),
				tx: c,
				outputs: [],
			});

			setTxId(txid);
			console.log("TXID : ", txid);
		} catch (error) {
			console.error("Error creating free mint contract:", error);
		} finally {
			setLoading(false);
		}
	}

	async function transfer() {
		try {
			setLoading(true);

			const creatorAccount = new Account({
				wif: "cW84FgWG9U1MpKvdzZMv4JZKLSU7iFAzMmXjkGvGUvh5WvhrEASj",
				network: NETWORK,
			});

			const minterAccount = new Account({
				wif: "cMqUkLHLtHJ4gSBdxAVtgFjMnHkUi5ZXkrsoBcpECGrE2tcJiNDh",
				network: NETWORK,
			});

			const contract: BlockTxTuple = [101869, 1];
			const tx = txBuilder.transfer({
				transfers: [
					{
						amount: "100",
						asset: contract,
						output: 1,
					},
				],
			});

			const txid = await client.createAndBroadcastTx({
				account: minterAccount.p2pkh(),
				tx: tx,
				outputs: [{ address: creatorAccount.p2pkh().address, value: 1000 }],
			});

			setTxId(txid);
			console.log("TXID : ", txid);
		} catch (error) {
			console.error("Error transferring:", error);
		} finally {
			setLoading(false);
		}
	}

	return (

		<div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 container">
			<h1 className="text-2xl font-bold mb-4">Glittr NFT Minting</h1>

			<UploadComponent />
			<div className="flex flex-col gap-4">
				<button
					type="button"
					onClick={createFreeMintContract}
					disabled={loading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? "Processing..." : "Create Free Mint Contract"}
				</button>

				<button
					type="button"
					onClick={transfer}
					disabled={loading}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
				>
					{loading ? "Processing..." : "Transfer"}
				</button>
			</div>

			{txId && (
				<div className="mt-4 p-4 bg-gray-100 rounded">
					<p className="font-semibold">Transaction ID:</p>
					<p className="break-all">{txId}</p>
				</div>
			)}
		</div>
	);
}

export default App;
