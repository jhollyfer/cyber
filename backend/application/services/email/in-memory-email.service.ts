import { Service } from 'fastify-decorators';
import type { EmailContractService, SendMailPayload } from './email-contract.service';

@Service()
export default class InMemoryEmailService implements EmailContractService {
  public sentEmails: SendMailPayload[] = [];

  async send(payload: SendMailPayload): Promise<void> {
    this.sentEmails.push(payload);
  }
}
