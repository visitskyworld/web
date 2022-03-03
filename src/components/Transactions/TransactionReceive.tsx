import { ArrowDownIcon } from '@chakra-ui/icons'
import { Box, Collapse, Flex, Link, SimpleGrid } from '@chakra-ui/react'
import { Asset } from '@shapeshiftoss/types'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Amount } from 'components/Amount/Amount'
import { IconCircle } from 'components/IconCircle'
import { MiddleEllipsis } from 'components/MiddleEllipsis/MiddleEllipsis'
import { Row } from 'components/Row/Row'
import { RawText, Text } from 'components/Text'
import { TransactionStatus } from 'components/Transactions/TransactionStatus'
import { TxDetails } from 'hooks/useTxDetails/useTxDetails'
import { fromBaseUnit } from 'lib/math'

export const TransactionReceive = ({
  txDetails
}: {
  txDetails: TxDetails
  activeAsset?: Asset
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      <Flex
        alignItems='center'
        flex={1}
        justifyContent='space-between'
        textAlign='left'
        as='button'
        w='full'
        py={4}
        data-test='transaction-receive'
        onClick={toggleOpen}
      >
        <Flex alignItems='center' width='full'>
          <IconCircle mr={3}>
            <ArrowDownIcon color='green.500' />
          </IconCircle>

          <Flex justifyContent='flex-start' flex={1} alignItems='center'>
            <Box flex={1}>
              <Text
                fontWeight='bold'
                overflow='hidden'
                flex={1}
                textOverflow='ellipsis'
                maxWidth='60%'
                lineHeight='1'
                whiteSpace='nowrap'
                mb={2}
                translation={[`transactionRow.${txDetails.type.toLowerCase()}`, { symbol: '' }]}
              />
              <RawText color='gray.500' fontSize='sm' lineHeight='1'>
                {dayjs(txDetails.tx.blockTime * 1000).fromNow()}
              </RawText>
            </Box>

            <Flex flexDir='column' ml='auto' textAlign='right'>
              <Amount.Crypto
                color='green.500'
                value={fromBaseUnit(txDetails.value, txDetails.precision)}
                symbol={txDetails.symbol}
                maximumFractionDigits={6}
                prefix=''
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Collapse in={isOpen} unmountOnExit>
        <SimpleGrid gridTemplateColumns='repeat(auto-fit, minmax(180px, 1fr))' spacing='4' py={6}>
          <Row variant='vertical'>
            <Row.Label>
              <Text translation='transactionRow.date' />
            </Row.Label>
            <Row.Value>{dayjs(Number(txDetails.tx.blockTime) * 1000).format('LLL')}</Row.Value>
          </Row>
          <Row variant='vertical'>
            <Row.Label>
              <Text translation='transactionRow.txid' />
            </Row.Label>
            <Row.Value>
              <Link
                isExternal
                color='blue.500'
                href={`${txDetails.explorerTxLink}${txDetails.tx.txid}`}
              >
                <MiddleEllipsis address={txDetails.tx.txid} />
              </Link>
            </Row.Value>
          </Row>

          <Row variant='vertical' hidden={!txDetails.tradeTx}>
            <Row.Label>
              <Text translation={'transactionRow.amount'} />
            </Row.Label>
            <Row.Value>
              <Amount.Crypto
                value={fromBaseUnit(
                  txDetails.sellTx?.value ?? '0',
                  txDetails.sellAsset?.precision ?? 18
                )}
                symbol={txDetails.sellAsset?.symbol ?? ''}
                maximumFractionDigits={6}
              />
              <Text translation='transactionRow.for' />
              <Amount.Crypto
                value={fromBaseUnit(
                  txDetails.buyTx?.value ?? '0',
                  txDetails.buyAsset?.precision ?? 18
                )}
                symbol={txDetails.buyAsset?.symbol ?? ''}
                maximumFractionDigits={6}
              />
            </Row.Value>
          </Row>

          <Row variant='vertical'>
            <Row.Label>
              <Text translation='transactionRow.fee' />
            </Row.Label>
            <Row.Value>
              {txDetails.tx?.fee && txDetails.feeAsset && (
                <Amount.Crypto
                  value={fromBaseUnit(
                    txDetails.tx?.fee?.value ?? '0',
                    txDetails.feeAsset?.precision ?? 18
                  )}
                  symbol={txDetails.feeAsset.symbol}
                  maximumFractionDigits={6}
                />
              )}
            </Row.Value>
          </Row>
          <TransactionStatus txStatus={txDetails.tx.status} />
          <Row variant='vertical'>
            <Row.Label>
              <Text translation={'transactionRow.from'} />
            </Row.Label>
            <Row.Value>
              <Link
                isExternal
                color='blue.500'
                href={`${txDetails.explorerAddressLink}${txDetails.ensFrom ?? txDetails.from}`}
              >
                <MiddleEllipsis address={txDetails.ensFrom ?? txDetails.from} />
              </Link>
            </Row.Value>
          </Row>
        </SimpleGrid>
      </Collapse>
    </>
  )
}
