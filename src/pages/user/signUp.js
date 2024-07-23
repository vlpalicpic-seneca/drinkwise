import React, { useRef, useState } from 'react';
import {
  Box, Container, Flex, Input, Button, InputGroup, Stack, Link, FormControl, InputRightElement, useToast, Tooltip
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons'; // Import InfoIcon from Chakra UI
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDrinkContext } from '../../../context/drinkContext';

export const validatePasswordReq = (password) => {
  // Password validation regex (>=8 characters, >=1 letter, >=1 number, >=1 special character)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
}

const SignUp = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Toast messages
    const toastMessages = {
      signUpSuccess: {
        title: 'Sign Up successful.',
        description: `Welcome, ${username}! You have successfully signed up.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      },
      signUpFailedPassword: {
        title: 'Sign Up failed.',
        description: "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      },
      signUpFailedMatch: {
        title: 'Sign Up failed.',
        description: "Passwords do not match.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      },
      signUpFailedEmail: {
        title: 'Sign Up failed.',
        description: "Email already exists.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      },
      signUpFailed: {
        title: 'Sign Up failed.',
        description: "Something went wrong. Please try again.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      }
    };

    // Validation checks
    if (!validatePasswordReq(password)) {
      toast(toastMessages.signUpFailedPassword);
      return;
    } else if (!validateConfirmPassword(password, confirmPassword)) {
      toast(toastMessages.signUpFailedMatch);
      return;
    }

    // Register new customer
    try {
      const response = await fetch('/api/customerRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, emailAddress: email, password: password }),
      });

      if (response.ok) {
        emailRef.current.value = '';
        usernameRef.current.value = '';
        passwordRef.current.value = '';
        confirmPasswordRef.current.value = '';
        setShowPassword(false);
        toast(toastMessages.signUpSuccess);
      } else if (response.status === 400) { // Email already exists
        toast(toastMessages.signUpFailedEmail);
      } else {
        toast(toastMessages.signUpFailed);
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      toast(toastMessages.signUpFailed);
    }
  };

  return (
    <Box bg='#bcc8c3'>
      <Navbar />
      <Container w='100vw' h='100vh' maxH='100vh' maxW='7xl'>
        <Flex
          flexDirection="column"
          width="100wh"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Box minW={{ base: "90%", md: "468px" }}>
              <form onSubmit={handleSignUp}>
                <Stack
                  spacing={4}
                  p="3rem"
                  backgroundColor="#a0b2ab"
                  boxShadow="md"
                  borderRadius='2em'
                >
                  <FormControl>
                    <InputGroup>
                      <Input
                        ref={emailRef}
                        type="email"
                        placeholder="you@domain.com"
                        backgroundColor="whiteAlpha.900"
                        required
                        autocomplete="off"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <Input
                        ref={usernameRef}
                        type="text"
                        placeholder="Username"
                        backgroundColor="whiteAlpha.900"
                        required
                        autocomplete="off"
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <Input
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        backgroundColor="whiteAlpha.900"
                        required
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <Input
                        ref={confirmPasswordRef}
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        backgroundColor="whiteAlpha.900"
                        required
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Button
                      borderRadius={'2em'}
                      type="submit"
                      variant="solid"
                      width="full"
                      _hover={{ bg: 'teal' }}
                    >
                      Sign Up
                    </Button>
                    <Tooltip label="Password must be at least 8 characters long and contain at least one letter, one number, and one special character." aria-label="Password requirements">
                      <InfoIcon ml={4} color="white" />
                    </Tooltip>
                  </Flex>
                </Stack>
              </form>
            </Box>
          </Stack>
          <Box>
            Have an account?{" "}
            <Link href="/login" _hover={{ color: 'teal' }}> Login </Link>
          </Box>
        </Flex>
        <Footer />
      </Container>
    </Box>
  );
};

export default SignUp;
