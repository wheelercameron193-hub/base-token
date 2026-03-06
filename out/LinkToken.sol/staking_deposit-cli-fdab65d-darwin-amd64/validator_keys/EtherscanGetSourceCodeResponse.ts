import { EtherscanSourceCodeEntry } from "./EtherscanSourceCodeEntry";


export type EtherscanGetSourceCodeResponse = {
  status: string;
  message: string;
  result: EtherscanSourceCodeEntry[] | string;
};
