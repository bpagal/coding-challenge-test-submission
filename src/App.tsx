import React from 'react';

import Address from '@/components/Address/Address';
import AddressBook from '@/components/AddressBook/AddressBook';
import Button from '@/components/Button/Button';
import InputText from '@/components/InputText/InputText';
import Radio from '@/components/Radio/Radio';
import Section from '@/components/Section/Section';
import useAddressBook from '@/hooks/useAddressBook';

import styles from './App.module.css';
import { Address as AddressType } from './types';
import { useAddressFormValues } from '@/hooks/useAddressFormValues';

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
      `api/getAddresses?postcode=${postcode}&streetnumber=${houseNumber}`,
    );
    const data = await res.json();
    setAddresses(data.details);
  };
  const { selectedAddress } = formValues;

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
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
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handleFormValueChange('postcode')}
                placeholder="Post Code"
                value={formValues.postcode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleFormValueChange('houseNumber')}
                placeholder="House number"
                value={formValues.houseNumber}
              />
            </div>
            <Button type="submit">Find</Button>
          </fieldset>
        </form>
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
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFormValueChange('firstName')}
                  value={formValues.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleFormValueChange('lastName')}
                  value={formValues.lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
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
