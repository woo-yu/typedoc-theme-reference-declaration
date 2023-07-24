/**
 * 설명합니다
 * @category SDK가이드 Use
 */
export function commentSDK(injected: number) {
    const authorized = { user: true };

    return {
        /**
         * 로그인된 사용자인지 확인
         * 인증정보가 제대로 주입되었는지 여부를 판단하기 위해 사용하는 것이며,
         * 사용자 정보를 활용하기 위해서는 각 화면에 맞는 getHome()을 호출 필요.
         */
        async isLogin() {
            return authorized.user !== null;
        },
    };
}
