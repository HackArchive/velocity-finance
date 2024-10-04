/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.8
  Forc version: 0.64.0
  Fuel-Core version: 0.36.0
*/

import { Contract, ContractFactory, decompressBytecode } from "fuels";
import type { Provider, Account, DeployContractOptions, DeployContractResult } from "fuels";

import { TestContract } from "./TestContract";

const bytecode = decompressBytecode("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");

export class TestContractFactory extends ContractFactory {

  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, TestContract.abi, accountOrProvider);
  }

  deploy<TContract extends Contract = Contract>(
    deployOptions?: DeployContractOptions
  ): Promise<DeployContractResult<TContract>> {
    return super.deploy({
      storageSlots: TestContract.storageSlots,
      ...deployOptions,
    });
  }

  static async deploy (
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<TestContract>> {
    const factory = new TestContractFactory(wallet);
    return factory.deploy(options);
  }
}
