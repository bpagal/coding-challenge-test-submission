import React from 'react';

import Address from '@/components/Address/Address';
import AddressBook from '@/components/AddressBook/AddressBook';
import Radio from '@/components/Radio/Radio';
import Section from '@/components/Section/Section';
import useAddressBook from '@/hooks/useAddressBook';

import { Address as AddressType } from './types';
import { useAddressFormValues } from '@/hooks/useAddressFormValues';
import Form from '@/components/Form/Form';
import transformAddress from './core/models/address';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/Button/Button';

const BASE_API_URL = `${process.env.NEXT_PUBLIC_URL}/api`;

function App() {
  const { formValues, handleFormValueChange, resetFormValues } =
    useAddressFormValues();

  /**
   * Results states
   */
  const [fetchAddressStatus, setFetchAddressStatus] = React.useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const { postcode, houseNumber } = formValues;

    setAddresses([]);
    setFetchAddressStatus('loading');
    setError(undefined);

    try {
      const response = await fetch(
        `${BASE_API_URL}/getAddresses?postcode=${postcode}&streetnumber=${houseNumber}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        setFetchAddressStatus('error');
        setError(errorData.errormessage);
      }

      const data = await response.json();
      const newAddresses = data.details.map(transformAddress);
      setAddresses(newAddresses);
      setFetchAddressStatus('success');
    } catch (err) {
      console.error(err);
    }
  };
  const { selectedAddress } = formValues;

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't",
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress,
    );

    if (!foundAddress) {
      setError('Selected address not found');
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
    });
  };

  const handleClearClick = () => {
    resetFormValues();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label={'🏠 Find an address'}
          loading={fetchAddressStatus === 'loading'}
          formEntries={[
            {
              name: 'postCode',
              placeholder: 'Post Code',
              extraProps: {
                value: formValues.postcode,
                onChange: handleFormValueChange('postcode'),
              },
            },
            {
              name: 'houseNumber',
              placeholder: 'House number',
              extraProps: {
                value: formValues.houseNumber,
                onChange: handleFormValueChange('houseNumber'),
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText={'Find'}
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleFormValueChange('selectedAddress')}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {selectedAddress && (
          <Form
            label={'✏️ Add personal info to address'}
            loading={false}
            formEntries={[
              {
                name: 'firstName',
                placeholder: 'First name',
                extraProps: {
                  onChange: handleFormValueChange('firstName'),
                  value: formValues.firstName,
                },
              },
              {
                name: 'lastName',
                placeholder: 'Last name',
                extraProps: {
                  onChange: handleFormValueChange('lastName'),
                  value: formValues.lastName,
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText={'Add to addressbook'}
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button
          loading={false}
          type="button"
          variant="secondary"
          onClick={handleClearClick}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
