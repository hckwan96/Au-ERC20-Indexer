import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Flex, Link } from '@chakra-ui/react';

const CustomConnectButton = ({ setUserAddress, setNetwork }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        const getExplorerUrl = (chainId) => {
          if (chainId === 56) {
            return { name: 'BscScan', url: 'https://bscscan.com' };
          } else if (chainId === 1) {
            return { name: 'Ethereum', url: 'https://etherscan.io' };
          } else if (chainId === 11155111) {
            return { name: 'Sepolia', url: 'https://sepolia.etherscan.io' };
          } else if (chainId === 42161) {
            return { name: 'Arbitrum', url: 'https://arbiscan.io/' };
          }
          return chain?.blockExplorers?.default;
        };

        const explorer = getExplorerUrl(chain?.id);

        // Use `useEffect` to update `setUserAddress` and `setNetwork` after the component has mounted
        useEffect(() => {
          if (connected) {
            setUserAddress(account?.address || '');
            const network = chain?.name.toLowerCase() === "sepolia" ? 'eth-sepolia' : 'eth-mainnet';
            setNetwork(network);
          }
        }, [account?.address, chain?.name]);

        if (!ready) {
          return null; // Prevent rendering when not ready
        }

        return (
          <div>
            {!connected ? (
              <Button onClick={openConnectModal} colorScheme="blue" size="md">
                Connect Wallet
              </Button>
            ) : chain?.unsupported ? (
              <Button onClick={openChainModal} colorScheme="red" size="md">
                Wrong network
              </Button>
            ) : (
              <Flex align="center" gap={3}>
                <Button onClick={openChainModal} colorScheme="blue" size="md">
                  {chain?.name ?? 'Unknown Chain'}
                </Button>
                <Button onClick={openAccountModal} colorScheme="blue" size="md">
                  {account?.displayName}
                  {account?.displayBalance ? ` (${account.displayBalance})` : ''}
                </Button>
                {explorer && (
                  <Link
                    href={`${explorer.url}/address/${account?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                    textDecoration="underline"
                    _hover={{ color: 'blue.600' }}
                  >
                    View on {explorer.name}
                  </Link>
                )}
              </Flex>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
