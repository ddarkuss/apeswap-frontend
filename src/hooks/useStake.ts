import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateBurningUserStakedBalance,
  updateBurningUserBalance,
} from 'state/actions'
import { stake, sousStake, sousStakeBnb, sousBurningStake } from 'utils/callHelpers'
import { useBurningSousChef, useMasterchef, useSousChef } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const useBurningSousStake = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousBurningChefContract = useBurningSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      console.log(amount)
      await sousBurningStake(sousBurningChefContract, amount, account)
      dispatch(updateBurningUserStakedBalance(sousId, account))
      dispatch(updateBurningUserBalance(sousId, account))
    },
    [account, dispatch, sousBurningChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
