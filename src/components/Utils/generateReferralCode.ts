const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referalCode = '';
    for (let i = 0; i < 8; i++) {
      referalCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referalCode;
  };

  export default generateReferralCode;