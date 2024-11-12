import {
  Account,
  type BlockTxTuple,
  GlittrSDK,
  txBuilder,
} from "@glittr-sdk/sdk";
import { useState } from "react";
import "./App.css";

function App() {
	const [txId, setTxId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [contractId, setContractId] = useState<BlockTxTuple>([0, 0]);

	const NETWORK = "regtest";
	const CREATOR_WIF = "cW84FgWG9U1MpKvdzZMv4JZKLSU7iFAzMmXjkGvGUvh5WvhrEASj";
	const MINTER_WIF = "cMqUkLHLtHJ4gSBdxAVtgFjMnHkUi5ZXkrsoBcpECGrE2tcJiNDh";

	const getClient = () => {
		return new GlittrSDK({
			network: NETWORK,
			electrumApi: "https://devnet-electrum.glittr.fi",
			glittrApi: "https://devnet-core-api.glittr.fi",
		});
	};

	const getAccount = (wif: string) => {
		return new Account({
			wif,
			network: NETWORK,
		});
	};

	const handleCreateContract = async () => {
		setIsLoading(true);
		setError("");

		try {
			const client = getClient();
			const account = getAccount(CREATOR_WIF);

			const contract = txBuilder.freeMintContractInstantiate({
				simple_asset: {
					supply_cap: 2000n.toString(),
					divisibility: 18,
					live_time: 0,
				},
				amount_per_mint: 2n.toString(),
			});

			const txid = await client.createAndBroadcastTx({
				account: account.p2pkh(),
				tx: contract,
				outputs: [],
			});

			setTxId(txid);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleTransfer = async () => {
		setIsLoading(true);
		setError("");

		try {
			const client = getClient();
			const creatorAccount = getAccount(CREATOR_WIF);
			const minterAccount = getAccount(MINTER_WIF);

			const tx = txBuilder.transfer({
				transfers: [
					{
						amount: "100",
						asset: contractId,
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
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8">Glittr SDK Demo</h1>

			<div className="space-y-6">
				{/* Contract Info Input */}
				<div className="p-4 border rounded-lg bg-white shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Contract Information</h2>
					<div className="flex gap-4 mb-4">
						<input
							type="number"
							placeholder="Block"
							className="px-3 py-2 border rounded"
							value={contractId[0]}
							onChange={(e) =>
								setContractId([Number.parseInt(e.target.value), contractId[1]])
							}
						/>
						<input
							type="number"
							placeholder="Transaction Position"
							className="px-3 py-2 border rounded"
							value={contractId[1]}
							onChange={(e) =>
								setContractId([contractId[0], Number.parseInt(e.target.value)])
							}
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="p-4 border rounded-lg bg-white shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Actions</h2>
					<div className="flex flex-wrap gap-4">
						<button
            type="button"
							onClick={handleCreateContract}
							disabled={isLoading}
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
						>
							{isLoading ? "Creating..." : "Create Contract"}
						</button>

						<button
            type="button"
							onClick={handleTransfer}
							disabled={isLoading || contractId[0] === 0}
							className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
						>
							{isLoading ? "Transferring..." : "Transfer"}
						</button>
					</div>
				</div>

				{/* Status Messages */}
				{error && (
					<div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700">
						<h3 className="font-semibold">Error:</h3>
						<p>{error}</p>
					</div>
				)}

				{txId && (
					<div className="p-4 border border-green-300 rounded-lg bg-green-50">
						<h3 className="font-semibold text-green-700">Transaction ID:</h3>
						<p className="font-mono break-all">{txId}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;