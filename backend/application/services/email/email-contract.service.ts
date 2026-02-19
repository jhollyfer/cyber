export interface SendMailPayload {
  to: string;
  subject: string;
  html: string;
}

export abstract class EmailContractService {
  abstract send(payload: SendMailPayload): Promise<void>;
}
