import { Service } from 'fastify-decorators';
import type { EmailContractService, SendMailPayload } from './email-contract.service';

@Service()
export default class NodemailerEmailService implements EmailContractService {
  async send(payload: SendMailPayload): Promise<void> {
    // Nodemailer implementation placeholder
    // Will be configured when SMTP credentials are provided
    console.log(`[Email] Would send to: ${payload.to}, subject: ${payload.subject}`);
  }
}
