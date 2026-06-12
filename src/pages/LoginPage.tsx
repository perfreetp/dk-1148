import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Bird } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardContent } from '../components/common/Card';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('birdwatcher@example.com');
  const [password, setPassword] = useState('password');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-4 shadow-warm-lg">
            <Bird className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            同趣
          </h1>
          <p className="text-text-secondary">
            发现志同道合的伙伴
          </p>
        </div>

        <Card className="p-6">
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="邮箱"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="密码"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                登录
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent-dark transition-colors"
                >
                  还没有账号？立即注册
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-primary/10">
              <p className="text-xs text-text-muted text-center mb-3">
                演示账号（点击登录即可体验）
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>邮箱：</span>
                  <span className="font-mono text-xs">birdwatcher@example.com</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>密码：</span>
                  <span className="font-mono text-xs">任意密码即可</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-text-muted mt-6">
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
