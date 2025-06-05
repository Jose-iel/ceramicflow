
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Shield, 
  Truck, 
  BarChart3, 
  Users, 
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Mountain,
  Factory,
  Zap,
  Target,
  Award,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">CeramicFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Recursos</a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Preços</a>
              <a href="#faq" className="text-gray-600 hover:text-orange-600 transition-colors">FAQ</a>
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                🎯 Sistema Especializado para Cerâmicas
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transforme sua
                <span className="text-orange-600 block">Cerâmica Digital</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gerencie produção, estoque, funcionários e veículos em uma única plataforma. 
                Aumente sua produtividade em até 40% com tecnologia feita especialmente para cerâmicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
                  Comece Grátis Por 7 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg">
                  Agende uma Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Configuração em 5 minutos</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/placeholder.svg" 
                  alt="Dashboard do CeramicFlow" 
                  className="w-full h-96 object-cover rounded-lg bg-gradient-to-br from-orange-100 to-red-100"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">40%</div>
                <div className="text-sm">Aumento de Produtividade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-8">Confiado por mais de 150+ cerâmicas em todo o Brasil</p>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-600 font-medium">4.9/5 - Avaliação dos nossos clientes</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o CeramicFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvido especificamente para as necessidades únicas das cerâmicas brasileiras
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Economize 5h por dia",
                description: "Automatize processos manuais e reduza o tempo gasto em planilhas e controles obsoletos"
              },
              {
                icon: Shield,
                title: "Controle Total",
                description: "Monitore produção, estoque de barro e lenha, manutenção de equipamentos em tempo real"
              },
              {
                icon: Truck,
                title: "Gestão de Frota",
                description: "Controle completo de veículos, manutenções preventivas e consumo de combustível"
              },
              {
                icon: BarChart3,
                title: "Relatórios Inteligentes",
                description: "Dashboards com insights práticos para tomar decisões estratégicas baseadas em dados"
              },
              {
                icon: Users,
                title: "Gestão de Equipe",
                description: "Organize funcionários, operadores e responsabilidades de forma eficiente"
              },
              {
                icon: Factory,
                title: "Específico para Cerâmicas",
                description: "Feito por quem entende do setor - controle de forno, queima, matéria-prima e muito mais"
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 text-orange-600 mb-4" />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Completos
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que sua cerâmica precisa em uma única plataforma
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Mountain,
                  title: "Controle de Matéria-Prima",
                  description: "Gerencie estoque de barro, acompanhe consumo por projeto e previna faltas de material"
                },
                {
                  icon: Zap,
                  title: "Gestão de Lenha e Energia",
                  description: "Monitore consumo de lenha, calcule custos de queima e otimize o uso do forno"
                },
                {
                  icon: Truck,
                  title: "Frota e Manutenção",
                  description: "Controle preventivo de equipamentos, agendamento de manutenções e histórico completo"
                },
                {
                  icon: Target,
                  title: "Operações e Produção",
                  description: "Acompanhe etapas de produção, controle de qualidade e prazos de entrega"
                }
              ].map((feature, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Interface do sistema" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl bg-gradient-to-br from-orange-100 to-red-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            🔥 Oferta de Lançamento - Por Tempo Limitado
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Seja uma das primeiras 50 cerâmicas a testar nosso sistema e garanta desconto vitalício de 30%
          </p>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Badge className="bg-white text-orange-600 text-lg px-4 py-2">
              ⚡ Apenas 23 vagas restantes
            </Badge>
            <Badge className="bg-orange-700 text-white text-lg px-4 py-2">
              🎯 Desconto vitalício garantido
            </Badge>
          </div>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Quero Garantir Minha Vaga
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o tamanho da sua cerâmica
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "R$ --,--",
                period: "/mês",
                description: "Perfeito para cerâmicas pequenas",
                features: [
                  "Até 2 usuários",
                  "Gestão básica de estoque",
                  "Controle de produção",
                  "Relatórios simples",
                  "Suporte por email"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "R$ --,--", 
                period: "/mês",
                description: "Ideal para cerâmicas em crescimento",
                features: [
                  "Até 10 usuários",
                  "Gestão completa de frota",
                  "Controle avançado de matéria-prima",
                  "Dashboards detalhados",
                  "Suporte prioritário",
                  "Integração com sistema fiscal"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Sob consulta",
                period: "",
                description: "Para grandes operações",
                features: [
                  "Usuários ilimitados",
                  "Módulos personalizados",
                  "API completa",
                  "Treinamento dedicado",
                  "Suporte 24/7",
                  "Gerente de conta exclusivo"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-orange-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-600 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    Seja o primeiro a saber
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💰 Garantia de 30 dias - Se não gostar, devolvemos 100% do seu dinheiro
            </p>
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Falar com um Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o CeramicFlow
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "Como funciona o período de teste gratuito?",
                answer: "Você tem 7 dias para testar todas as funcionalidades sem limitações. Não pedimos cartão de crédito e você pode cancelar a qualquer momento."
              },
              {
                question: "O sistema funciona offline?",
                answer: "O CeramicFlow é baseado na nuvem, mas possui modo offline limitado para operações essenciais. Os dados são sincronizados quando a conexão for restaurada."
              },
              {
                question: "Posso migrar meus dados atuais?",
                answer: "Sim! Nossa equipe ajuda na migração dos seus dados de planilhas ou outros sistemas. O processo é gratuito e leva em média 2-3 dias."
              },
              {
                question: "O sistema se integra com meu contador?",
                answer: "Sim, o CeramicFlow gera relatórios compatíveis com os principais sistemas contábeis e permite exportação para diversos formatos."
              },
              {
                question: "Preciso de treinamento para usar?",
                answer: "O sistema é intuitivo, mas oferecemos treinamento gratuito para sua equipe via videoconferência e materiais de apoio."
              },
              {
                question: "E se eu precisar de funcionalidades específicas?",
                answer: "Desenvolvemos módulos personalizados conforme sua necessidade. Entre em contato para discutir suas demandas específicas."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-orange-100">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para revolucionar sua cerâmica?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de ceramistas que já transformaram seus negócios com o CeramicFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Começar Teste Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Agendar Demonstração
            </Button>
          </div>
          <p className="text-orange-100 mt-6 text-sm">
            ✅ Sem compromisso • ✅ Configuração gratuita • ✅ Suporte dedicado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Mountain className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold">CeramicFlow</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                O sistema de gestão mais completo para cerâmicas. Desenvolvido por especialistas do setor para otimizar sua produção.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-gray-700 text-gray-400 hover:text-white hover:border-white">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-700 text-gray-400 hover:text-white hover:border-white">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Treinamentos</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 CeramicFlow. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
