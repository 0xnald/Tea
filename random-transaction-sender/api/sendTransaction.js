// Import the ethers library
const { ethers } = require('ethers');

// Alchemy Sepolia RPC URL
const rpcUrl = 'https://tea-sepolia.g.alchemy.com/public';

// Create a provider
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Serverless function to send a random transaction
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { recipientAddress } = req.body;

        if (!recipientAddress) {
            return res.status(400).json({ error: 'Recipient address is required' });
        }

        // Generate a random wallet
        const wallet = ethers.Wallet.createRandom();
        const connectedWallet = wallet.connect(provider);

        // Generate a random amount (e.g., between 0.001 and 0.01 ETH)
        const randomAmount = Math.random() * (0.01 - 0.001) + 0.001;

        // Create a transaction
        const tx = {
            to: recipientAddress,
            value: ethers.utils.parseEther(randomAmount.toFixed(18)),
        };

        try {
            // Send the transaction
            const transactionResponse = await connectedWallet.sendTransaction(tx);
            await transactionResponse.wait();

            return res.status(200).json({ hash: transactionResponse.hash });
        } catch (error) {
            return res.status(500).json({ error: 'Error sending transaction', details: error.message });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
