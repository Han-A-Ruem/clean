import AddressSelection from '@/components/AddressSelection';
import DateSelectionStep from '@/components/DateSelectionStep';
import ServiceSelection from '@/components/ServiceSelection';
import ReservationConfirmation from '@/components/reservation-info/ReservationConfirmation';
import { InfoComponent } from '@/components/home';
import { ReminderComponent } from '@/components/reservation-info';
import BookingComplete from '@/components/BookingComplete';
import KitchenServiceDetails from '@/components/KitchenServiceDetails';
import CustomView from '@/components/home/CustomView';
import ToiletServiceDetails from '@/components/ToiletServiceDetails';
import RefrigeratorServiceDetails from '@/components/RefrigeratorServiceDetails';
import ReviewForm from '@/components/home/reservation-detail/ReviewForm';
import RequestedServicesPage from '@/components/home/reservation-detail/RequestedServicesPage';
import CleanerSelection from '@/components/cleaner/CleanerSelection';
import CleanerInformation from '@/components/cleaner/CleanerInformation';
import TestWageSelector from '@/pages/TestWageSelector';
import CleanArrowDetails from '@/components/bookings/CleanArrowDetails';
import ResidentSelection from '@/components/reservation-info/ResidentSelection';

export const getReservationComponent = (id: string , { navigate, reservationData, setReservationData, createReservation , user } ) => {
  const handleBack = () => {
    navigate(-1);
  };

  console.log({ msg: 'reservation', reservationData });

  switch (id) {
    case 'address':
      return <AddressSelection
        onNext={(addressData) => {
          setReservationData({
            'address': addressData.id,
            'area_thresh': addressData.area,
          })
          console.log('address', reservationData)
          navigate('/reservation/datetime');
        }}
      />;
    case 'update-address':
      return <AddressSelection
        onBack={() => navigate('/reservation/reminder')}
        onNext={(addressData) => {
          setReservationData({
            'address': addressData.id,
            'area_thresh': addressData.area,
          })
          console.log('address', reservationData)
          navigate('/reservation/reminder');
        }} />
    case 'datetime':
      return <DateSelectionStep
        reservationData={reservationData}
        onBack={() => navigate('/reservation/address')}
        onNext={() => {
          console.log({ msg: 'datetime complete', reservationData });
          navigate('/reservation/resident-selection');
        }}
        setReservationData={setReservationData}
      />;
    case 'resident-selection':
      return <ResidentSelection
        reservationData={reservationData}
        setReservationData={setReservationData}
        onNext={() => {
          console.log({ msg: 'resident selection complete', reservationData });
          navigate('/reservation/cleaner-selection');
        }}
      />;
    case 'cleaner-selection':
      return reservationData.reservation_type == 'onetime' ? (
        <TestWageSelector />
      ) : (
        <CleanerSelection
          cleanerType={reservationData.cleaner_type === 'regular' ? 'regular' : 'luxury'}
          onNext={(cleanerId) => {
            setReservationData({
              cleaner_id: cleanerId,
              cleaner_type: reservationData.selectedOption
            });
            console.log({ msg: 'cleaner selected', cleanerId });
            navigate(`/reservation/cleaner-info?cleanerId=${cleanerId}`);
          }}
        />
      );
    case 'service':
      return <ServiceSelection
        onServiceSelect={() => navigate('/reservation/payment')}
      />;
    case 'cleaner-info': 
      return <CleanerInformation onNext={(cleaner) => {
        setReservationData({cleaner_id: cleaner.id}) 
        navigate('/reservation/info')
      }} />
    case 'info':
      return <InfoComponent
        reservationInfo={reservationData}
        setReservationData={setReservationData}
        onBack={() => navigate('/reservation/cleaner-selection')}
        onSubmit={() => {
          navigate('/reservation/reminder');
          console.log('reservation data', reservationData);
        }}
      />;
    case "custom":
      return (
        <CustomView onBack={() => {
          navigate('/');
        }} />
      );
    case 'reminder':
      return <ReminderComponent
        customerInfo={reservationData}
        onCustomerInfoChange={setReservationData}
        onBack={() => navigate('/reservation/info')}
        onNext={() => {
          navigate('/reservation/confirmation');
          console.log({ msg: 'reminder complete', reservationData });
        }}
        title="매주 화요일"
      />;
    case 'complete':
      return <BookingComplete
        date={new Date()}
        time={reservationData.time || ''}
        address={{
          street: typeof reservationData.address === 'string' ? reservationData.address : '',
          detail: ''
        }}
      />;
    case 'confirmation':
      return <ReservationConfirmation
        customerInfo={reservationData}
        onBack={handleBack}
        onComplete={async () => {
          try {
            await createReservation({...reservationData, user: user.id});
            navigate('/reservation/complete');
          } catch (error) {
            console.error("Error creating reservation:", error);
            // You might want to show an error message to the user here
          }
        }}
      />;
    case 'house-info': 
      return <CleanArrowDetails />
    case 'kitchen':
      return<KitchenServiceDetails onBack={function (): void {
        throw new Error('Function not implemented.');
      } } onNext={function (): void {
        throw new Error('Function not implemented.');
      } } />
    case 'bathroom':
      return<ToiletServiceDetails onBack={function (): void {
        throw new Error('Function not implemented.');
      } } onNext={()=>  {
         navigate('/reservation/address');
      } } />
    case 'fridge':
      return<RefrigeratorServiceDetails onBack={function (): void {
        throw new Error('Function not implemented.');
      } } onNext={() => navigate('/reservation/address')} />
    case 'review':
      return <ReviewForm />;
    case 'requested-service':
      return <RequestedServicesPage />;
    default:
      return <div className="container p-4">예약 페이지를 찾을 수 없습니다</div>;
  }
};
