import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { X } from 'lucide-react';

interface AgentFormProps {
  agent: Agent | null;
  onClose: (shouldRefresh?: boolean) => void;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onClose }) => {
  const isEditing = !!agent;
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>({
    defaultValues: isEditing
      ? {
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          password: '',
          confirmPassword: '',
        }
      : {
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        },
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        // When editing, only include password if it was filled in
        const updateData = data.password
          ? data
          : {
              name: data.name,
              email: data.email,
              phone: data.phone,
            };

        await api.put(`/api/agents/${agent._id}`, updateData);
        toast.success('Agent updated successfully');
      } else {
        await api.post('/api/agents', data);
        toast.success('Agent added successfully');
        reset();
      }
      
      onClose(true); // Pass true to refresh the agent list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save agent');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Agent' : 'Add New Agent'}
          </h2>
          <button
            className="icon-button"
            onClick={() => onClose()}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="input w-full"
            />
            {errors.name && (
              <p className="text-[hsl(var(--error))] text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address',
                }
              })}
              className="input w-full"
            />
            {errors.email && (
              <p className="text-[hsl(var(--error))] text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number (with country code)
            </label>
            <input
              id="phone"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[0-9\s\-()]+$/,
                  message: 'Please enter a valid phone number',
                }
              })}
              className="input w-full"
              placeholder="+1 (123) 456-7890"
            />
            {errors.phone && (
              <p className="text-[hsl(var(--error))] text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { 
                required: isEditing ? false : 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                }
              })}
              className="input w-full"
            />
            {errors.password && (
              <p className="text-[hsl(var(--error))] text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: isEditing ? false : 'Please confirm your password',
                validate: value => !password || value === password || 'Passwords do not match'
              })}
              className="input w-full"
            />
            {errors.confirmPassword && (
              <p className="text-[hsl(var(--error))] text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {isEditing ? 'Update Agent' : 'Add Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentForm;