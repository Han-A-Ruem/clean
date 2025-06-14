
import { Badge } from "@/components/ui/badge";
import { services } from "@/data/servicesData";

interface Service {
  id: string;
  title: string;
  badge?: string;
  description: string;
  icon: any;
  category: string;
}

interface ServiceSelectionProps {
  onServiceSelect: (serviceId: string) => void;
}


const ServiceCard = ({ service, onSelect }: { service: Service; onSelect: (id: string) => void }) => (
  <button
    onClick={() => onSelect(service.id)}
    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <service.icon className="w-6 h-6 text-gray-600" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium">{service.title}</span>
          {service.badge && (
            <Badge variant="secondary" className={`${service.category === "전체 청소" ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
              {service.badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{service.description}</p>
      </div>
    </div>
    <div className="px-4 py-2 rounded-lg border text-sm text-user-theme border-user-theme">
      선택
    </div>
  </button>
);

const ServiceSelection = ({ onServiceSelect }: ServiceSelectionProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          원하는 가사 청소를<br />
          선택해 주세요.
        </h1>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg text-gray-600 mb-4">전체 청소</h2>
          <div className="space-y-4">
            {services
              .filter(service => service.category === "전체 청소")
              .map(service => (
                <ServiceCard key={service.id} service={service} onSelect={onServiceSelect} />
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg text-gray-600 mb-4">부분 청소</h2>
          <div className="space-y-4">
            {services
              .filter(service => service.category === "부분 청소")
              .map(service => (
                <ServiceCard key={service.id} service={service} onSelect={onServiceSelect} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
