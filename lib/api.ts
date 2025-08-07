import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://app.finiite.com/demo/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ActivationCodeData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ActivationCodeResponse {
  success: boolean;
  message: string;
  activationCode?: string;
  isExisting?: boolean;
}

export const activationApi = {
  createActivationCode: async (data: ActivationCodeData): Promise<ActivationCodeResponse> => {
    try {
      // Convert camelCase to snake_case for backend compatibility
      const transformedData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password
      };
      const response = await api.post('/activation-codes', transformedData);
      return {
        success: true,
        message: 'Activation code generated successfully',
        activationCode: response.data.activation_code,
        isExisting: response.data.is_existing,
      };
    } catch (error: any) {
             if (axios.isAxiosError(error)) {
         // Handle validation errors (422)
         if (error.response?.status === 422) {
           const validationErrors = error.response.data?.detail;
           let errorMessage = 'Validation error: ';
           
           if (Array.isArray(validationErrors)) {
             // FastAPI validation errors format
             errorMessage += validationErrors.map(err => err.msg).join(', ');
           } else if (typeof validationErrors === 'string') {
             errorMessage = validationErrors;
           } else if (typeof error.response.data === 'object') {
             // Try to extract error messages from the response
             errorMessage = Object.values(error.response.data).flat().join(', ');
           }
           
           throw {
             success: false,
             message: errorMessage,
           };
         }
         
         throw {
           success: false,
           message: error.response?.data?.detail || 'An error occurred while generating the activation code',
         };
       }
       throw {
         success: false,
         message: 'An error occurred while generating the activation code',
       };
    }
  },
};