import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  ChakraProvider,
  Link
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useChains, useAccount } from 'wagmi';
import CustomConnectButton from './CustomConnectButton'

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [network, setNetwork] = useState('eth-mainnet')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [SearchInfo, setSearchInfo] = useState('');

  async function getTokenBalance() {
    try
    {
      if (userAddress === "")
      {
        setError('No address was keyed in');
        return;
      }
      setLoading(true);
      setSearchInfo("Searching on " + network + " network.");
      setTokenDataObjects([]);
      setResults([]);
      setHasQueried(false);
    
      const config = {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
        network: network,
      };
    
      const alchemy = new Alchemy(config);
      const data = await alchemy.core.getTokenBalances(userAddress);

      setResults(data);
    
      const tokenDataPromises = data.tokenBalances.map((token) =>
        alchemy.core.getTokenMetadata(token.contractAddress)
      );
    
      const resolvedTokenData = await Promise.all(tokenDataPromises);
      setError('');
      setTokenDataObjects(resolvedTokenData);
      setHasQueried(true);
      setLoading(false);
      setSearchInfo("");
    }
    catch (err)
    {
      setError(err.toString());
    }
  }

  return (
    <ChakraProvider>
      <Flex justifyContent="end" padding={"50px 100px"}>
        <CustomConnectButton setUserAddress={setUserAddress} setNetwork={setNetwork} />
      </Flex>

      <Box w="100vw">
        <Center>
          <Flex
            alignItems={'center'}
            justifyContent="center"
            flexDirection={'column'}
          >
            <Heading mb={0} fontSize={36}>
              ERC-20 Token Indexer
            </Heading>
            <Text>
              Plug in an address and this website will return all of its ERC-20
              token balances!
            </Text>
          </Flex>
        </Center>
        <Flex
          w="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent={'center'}
        >
          <Heading mt={42}>
            Get all the ERC-20 token balances of this address:
          </Heading>
          <Input
            onChange={(e) => setUserAddress(e.target.value)}
            value={userAddress}
            color="black"
            w="600px"
            textAlign="center"
            p={4}
            bgColor="white"
            fontSize={20}
          />
          <Text p={5}>{SearchInfo}</Text>
          <Button fontSize={20} onClick={getTokenBalance} mt={4} bgColor="#3182ce" color="white">
            Check ERC-20 Token Balances
          </Button>

          <Heading my={22}>ERC-20 token balances:</Heading>
          {
            loading  && !error ?
              <p>Loading...</p> 
              : error ?
                (
                  <>
                    <p>An error was encountered: </p>
                    <p>{error}</p>
                  </>
                )
              : hasQueried ?
                (
                  <SimpleGrid w={'90vw'} columns={4} spacing={20}>
                  {
                    results.tokenBalances.map((e, i) => {
                      const tokenData = tokenDataObjects[i];
                  
                      // Check if tokenData is undefined
                      if (!tokenData) return null;
                  
                      return (
                        <Flex
                          flexDir={'column'}
                          color="black"
                          bg="lightblue"
                          w={'17vw'}
                          h={'17vw'}
                          key={i}
                          border={'black solid'}
                          borderRadius={'30%'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          padding={'5px 5px'}
                        >
                          <Box>
                            <b>Symbol:</b> ${tokenData.symbol}&nbsp;
                          </Box>
                          <Box>
                            <b>Balance:</b>&nbsp;
                            {
                            formatNumber(Utils.formatUnits(
                              e.tokenBalance,
                              tokenData.decimals))
                            }
                          </Box>
                          {
                            tokenData.logo ?
                              (<Image src={tokenData.logo} alt="Token Logo" />) 
                              :
                              (<Image src="public/eth-logo.png" alt="Eth Logo" style={{width:'80px'}} />)
                          }
                        </Flex>
                      );
                    })
                  }
                  </SimpleGrid>
                )
                  : (
                    'Please make a query! This may take a few seconds...'
                  )}
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

function formatNumber(number, digit = 15)
{
  if (number < 1)
    return new Intl.NumberFormat("en-GB", {
        maximumFractionDigits: digit,
        notation:'scientific'
      }).format(number);
  else
    return new Intl.NumberFormat("en-GB").format(number);
}

export default App;