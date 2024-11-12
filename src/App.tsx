import {
	Account,
	type BlockTxTuple,
	GlittrSDK,
	txBuilder,
} from "@glittr-sdk/sdk";
import { useState } from "react";
import UploadComponent from "./UploadComponent";
import { GradientBackground } from "./components/gradientBackground";

const NETWORK = "regtest";

const client = new GlittrSDK({
	network: NETWORK,
	electrumApi: "https://hackathon-electrum.glittr.fi",
	glittrApi: "https://hackathon-core-api.glittr.fi",
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
		<GradientBackground>
			<div className="min-h-screen flex flex-col items-center justify-start p-4">
				<div className="w-full max-w-4xl mx-auto text-center space-y-6 py-12">
					<h1 className="text-4xl font-bold text-gray-100">
						Bitcoin L2 Token Minting
					</h1>
					<p className="text-xl text-gray-200 max-w-2xl mx-auto">
						Create and transfer NFTs on Bitcoin without Layer 2s. Powered by
						GLITTR. Experience the future of digital asset creation on the most
						secure blockchain.
					</p>
				</div>

				<div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
					<div className="space-y-8">
						<UploadComponent />

						<div className="flex flex-col gap-4">
							<button
								type="button"
								onClick={createFreeMintContract}
								disabled={loading}
								className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 disabled:opacity-50 transition-all
                font-medium text-lg"
							>
								{loading ? "Processing..." : "Create Free Mint Contract"}
							</button>

							<button
								type="button"
								onClick={transfer}
								disabled={loading}
								className="w-full px-6 py-3 bg-green-600 text-white rounded-lg
                hover:bg-green-700 disabled:opacity-50 transition-all
                font-medium text-lg"
							>
								{loading ? "Processing..." : "Transfer Token"}
							</button>
						</div>

						{txId && (
							<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
								<p className="font-semibold text-gray-700">Transaction ID:</p>
								<p className="break-all text-sm text-gray-600 mt-1">{txId}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</GradientBackground>
	);
}

export default App;
