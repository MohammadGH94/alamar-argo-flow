import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail } from 'lucide-react';

interface UserInfoFormProps {
  onSubmit: (userInfo: { name: string; email: string }) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Welcome to Alamar Argo
          </CardTitle>
          <p className="text-muted-foreground">
            Please provide your information to begin configuring your analytical pipeline
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10 text-base"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Optional: Provide your email to save and resume your pipeline configuration later
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!name.trim()}
            >
              Start Pipeline Configuration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};