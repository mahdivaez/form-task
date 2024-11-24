export interface FormData {
    fullName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    gender: string;
    militaryStatus: string;
    resume: File | null;
  }
  
  export interface FormErrors {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    birthDate?: string;
    gender?: string;
    militaryStatus?: string;
    resume?: string;
  }
  
  