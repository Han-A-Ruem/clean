import React from 'react';
import { PageHeader } from '../Utils';
import { useUser } from '@/contexts/UserContext';
import CustomerTerms from './CustomerTerms';
import ManagerTerms from './ManagerTerms';

const TermsOfUse = () => {

  const {userData} = useUser();


  if(userData?.type === 'cleaner'){
    return <ManagerTerms />
  }

  return  <CustomerTerms />
};

export default TermsOfUse;
