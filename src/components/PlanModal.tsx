import React, { useState } from 'react';
import { X, CreditCard, Check, Crown, Sparkles, Zap, Star, ExternalLink } from 'lucide-react';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (plan: 'free' | 'pro' | 'enterprise') => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free' as const,
      name: 'フリー',
      price: '¥0',
      period: '/月',
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      features: [
        '月3本まで生成',
        'ベーシックモデルのみ',
        'HD画質',
        '基本テンプレート'
      ],
      models: ['ベーシックAI']
    },
    {
      id: 'pro' as const,
      name: 'プロ',
      price: '¥2,980',
      period: '/月',
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      popular: true,
      features: [
        '月50本まで生成',
        'ベーシック + プロモデル',
        '4K画質',
        'プレミアムテンプレート',
        'ファイルアップロード'
      ],
      models: ['ベーシックAI', 'プロAI']
    },
    {
      id: 'enterprise' as const,
      name: 'エンタープライズ',
      price: '¥9,800',
      period: '/月',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      features: [
        '無制限生成',
        '全モデル利用可能',
        '8K画質',
        'カスタムテンプレート',
        'API連携',
        '専用サポート'
      ],
      models: ['ベーシックAI', 'プロAI', 'エンタープライズAI']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlan === 'free') {
      onPlanSelect(selectedPlan);
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Stripe決済ページへリダイレクト
      const stripeUrl = generateStripeCheckoutUrl(selectedPlan);
      
      // 新しいタブでStripe決済ページを開く
      const stripeWindow = window.open(stripeUrl, '_blank', 'width=800,height=600');
      
      // 決済完了を監視（実際の実装では、webhookやリダイレクトで処理）
      const checkPaymentStatus = setInterval(() => {
        if (stripeWindow?.closed) {
          clearInterval(checkPaymentStatus);
          // 決済完了と仮定してプランを更新
          onPlanSelect(selectedPlan);
          onClose();
          setIsProcessing(false);
        }
      }, 1000);

      // 5分後にタイムアウト
      setTimeout(() => {
        clearInterval(checkPaymentStatus);
        if (!stripeWindow?.closed) {
          stripeWindow?.close();
        }
        setIsProcessing(false);
      }, 300000);

    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('決済処理中にエラーが発生しました。もう一度お試しください。');
    }
  };

  const generateStripeCheckoutUrl = (plan: 'pro' | 'enterprise'): string => {
    // 実際の実装では、バックエンドAPIを呼び出してStripe Checkout URLを取得
    const baseUrl = 'https://checkout.stripe.com/pay/';
    const planPrices = {
      pro: 'price_pro_monthly_2980',
      enterprise: 'price_enterprise_monthly_9800'
    };
    
    // デモ用のURL（実際の実装では適切なStripe URLを使用）
    return `${baseUrl}${planPrices[plan]}?success_url=${encodeURIComponent(window.location.origin)}&cancel_url=${encodeURIComponent(window.location.origin)}`;
  };

  if (!isOpen) return null;

  const currentPlan = plans.find(p => p.id === selectedPlan)!;
  const Icon = currentPlan.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-800 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">Foobi</span>
            </div>
            <h2 className="text-3xl font-bold text-orange-900 mb-2">
              プランを選択
            </h2>
            <p className="text-gray-600">
              あなたに最適なプランで、Foobiの力を最大限に活用しましょう
            </p>
          </div>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${plan.borderColor} ${plan.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        人気
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <PlanIcon className={`w-8 h-8 mx-auto mb-2 ${plan.color}`} />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {plan.price}<span className="text-sm text-gray-500">{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">利用可能モデル:</h4>
                    <div className="space-y-1">
                      {plan.models.map((model, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {model}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Payment Information */}
          {selectedPlan !== 'free' && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Stripe決済について</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• 安全なStripe決済システムを使用</p>
                    <p>• クレジットカード、デビットカード対応</p>
                    <p>• 銀行振込（jp_bank_transfer）も利用可能</p>
                    <p>• アカウント登録不要で簡単決済</p>
                    <p>• サブスクリプション管理も柔軟に対応</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center ${
              selectedPlan === 'free' 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-800 hover:to-orange-700'
            } disabled:opacity-50`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                決済処理中...
              </>
            ) : selectedPlan === 'free' ? (
              '無料で始める'
            ) : (
              <>
                <ExternalLink className="w-5 h-5 mr-2" />
                Stripe決済ページで{currentPlan.price}を支払う
              </>
            )}
          </button>

          {selectedPlan !== 'free' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 text-center">
                Stripe決済ページが新しいタブで開きます。決済完了後、自動的にプランがアップグレードされます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanModal;