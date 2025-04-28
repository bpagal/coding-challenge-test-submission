import React from 'react';

import Address from '@/components/Address/Address';
import AddressBook from '@/components/AddressBook/AddressBook';
import Radio from '@/components/Radio/Radio';
import Section from '@/components/Section/Section';
import useAddressBook from '@/hooks/useAddressBook';

import { Address as AddressType } from './types';
import { useAddressFormValues } from '@/hooks/useAddressFormValues';
import Form from '@/components/Form/Form';

const BASE_API_URL = `${process.env.NEXT_PUBLIC_URL}/api`;

function App() {
  const { formValues, handleFormValueChange } = useAddressFormValues();

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const { postcode, houseNumber } = formValues;
    const res = await fetch(
      `${BASE_API_URL}/getAddresses?postcode=${postcode}&streetnumber=${houseNumber}`,
    );
    const data = await res.json();
    setAddresses(data.details);
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
          loading={true}
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
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label={'✏️ Add personal info to address'}
            loading={true}
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

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
