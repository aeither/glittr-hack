import { Account, GlittrSDK, txBuilder } from "@glittr-sdk/sdk";

async function main() {
	const NETWORK = "regtest";
	const client = new GlittrSDK({
		network: NETWORK,
		electrumApi: "https://11db-58-11-42-217.ngrok-free.app",
		glittrApi: "https://8c5d-58-11-42-217.ngrok-free.app",
		// electrumApi: "https://hackathon-electrum.glittr.fi",
		// glittrApi: "https://hackathon-core-api.glittr.fi",
	});

	const account = new Account({
		wif: "cW84FgWG9U1MpKvdzZMv4JZKLSU7iFAzMmXjkGvGUvh5WvhrEASj", // if (version !== network.wif) throw new Error('Invalid network version');
		// privateKey:
		// 	"d126410612bd15fa1a205c91a3bd2e27b7b85b5527aa4d223d9f7a72da3d2633", // Error: No inputs were signed
		network: NETWORK,
	});

	const c = txBuilder.freeMintContractInstantiate({
		simple_asset: {
			supply_cap: 2000n.toString(),
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

	console.log("TXID : ", txid);
}

main();
