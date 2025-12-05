export type CredentialStatus = 'Pending' | 'verified' | 'rejected';

export interface Credential {
  id: string;
  name: string;
  docType: string;
  docNumber: string;
  status: CredentialStatus;
  expiryDate: string;
  createdDate: string;
}
