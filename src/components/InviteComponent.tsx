import { PageHeader } from "./Utils";

declare global {
    interface Window {
        ReactNativeWebView?: any;
    }
}

const InviteComponent = () => {
    const handleShare = async () => {
        if(navigator.share) {
            try {
                await navigator.share({
                    title: "우리 앱 초대",
                    text: "이 놀라운 앱에 함께 가입하고 멋진 혜택을 누려보세요!",
                    url: `${window.location.origin}/signin`,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }   
        }
        else if (window.ReactNativeWebView) {
            // Send a message to the React Native WebView
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SHARE',
                title: "우리 앱 초대",
                text: "이 놀라운 앱에 함께 가입하고 멋진 혜택을 누려보세요!",
                url: `${window.location.origin}/signin`,
            }));
        } else {
            alert("이 브라우저에서는 공유가 지원되지 않습니다.");
        }
    };

    return (
        <div className="flex flex-col h-screen  ">
            <PageHeader title={""} />
            <div className=" flex  flex-col  justify-center items-center h-full p-6 rounded-lg text-center">

                <h2 className="text-xl font-bold mb-4">친구 초대하고 쿠폰 받기</h2>
                <div className="flex justify-center items-center mb-6">
                    <img
                        src="https://gjeqbjxadpscrovmrrui.supabase.co/storage/v1/object/public/event_images/invite/invite.jpg"
                        alt="Invite Benefit"
                        className="w-full object-contain"
                    />
                </div>
                <div>
                    <div>
                        <p className="text-lg font-medium mb-4">친구는 첫 캐시백 40% 혜택</p>      </div>
                    <p className="text-sm text-gray-600 mb-6">
                        친구를 초대하면 첫 캐시백 40% 혜택과 함께 특별 쿠폰을 받을 수 있습니다.
                    </p>
                </div>
                <button
                    onClick={handleShare}
                    className="bg-primary text-white py-2 px-4 rounded-lg  w-full shadow hover:bg-primary-dark"
                >
                    초대장 보내기
                </button>
            </div>
        </div>
    );
};

export default InviteComponent;