import { ethers, Signer, Wallet } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { TypedEvent, TypedEventFilter } from '../typechain/common';

export const randomSigners = async (amount: number, provider: Provider, allSigners: Signer[]) => {
  const signers: Wallet[] = [];
  for (let i = 0; i < amount; i++) {
    signers.push(Wallet.createRandom().connect(provider));
    const funder = allSigners[i % allSigners.length];
    await funder.sendTransaction({
      to: signers[signers.length - 1].address,
      value: ethers.utils.parseEther('1'),
    });
  }
  return signers;
};

/**
 * Finds the events that match the specified filter, and
 * returns these parsed and mapped to the appropriate type
 */
export function matchEvents<TArgsArray extends any[], TArgsObject>(
  events: ethers.Event[],
  contract: ethers.BaseContract,
  eventFilter: TypedEventFilter<TypedEvent<TArgsArray, TArgsObject>>,
): TypedEvent<TArgsArray, TArgsObject>[] {
  return events
    .filter((ev) => matchTopics(eventFilter.topics, ev.topics))
      .filter((ev) => {
        try{
          contract.interface.parseLog(ev).args;
          return true;
        }catch (e) {
          return false;
        }
      })
    .map((ev) => {
      const args = contract.interface.parseLog(ev).args;
      const result: TypedEvent<TArgsArray, TArgsObject> = {
        ...ev,
        args: args as TArgsArray & TArgsObject,
      };
      return result;
    });
}
function matchTopics(
  filter: Array<string | Array<string>> | undefined,
  value: Array<string>,
): boolean {
  // Implement the logic for topic filtering as described here:
  // https://docs.ethers.io/v5/concepts/events/#events--filters
  if (!filter) {
    return false;
  }
  for (let i = 0; i < filter.length; i++) {
    const f = filter[i];
    const v = value[i];
    if (typeof f == 'string') {
      if (f !== v) {
        return false;
      }
    } else {
      if (f.indexOf(v) === -1) {
        return false;
      }
    }
  }
  return true;
}
