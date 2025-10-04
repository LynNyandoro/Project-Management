import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUsers, FiTarget, FiTrendingUp, FiShield } from 'react-icons/fi';

const Welcome = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const features = [
    {
      icon: FiTarget,
      title: 'Project Management',
      description: 'Create, organize, and track your projects with ease. Set deadlines, assign tasks, and monitor progress.',
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Work together with your team members. Share updates, collaborate on tasks, and stay connected.',
    },
    {
      icon: FiTrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your progress with charts and analytics. Stay on top of your goals and milestones.',
    },
    {
      icon: FiShield,
      title: 'Secure & Reliable',
      description: 'Your data is safe with us. Enterprise-grade security with reliable cloud infrastructure.',
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="brand.500">
              ProjectFlow
            </Heading>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/login" variant="ghost">
                Sign In
              </Button>
              <Button as={RouterLink} to="/signup" colorScheme="brand">
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <VStack spacing={4} maxW="4xl">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
              fontWeight="bold"
            >
              Streamline Your Project Management
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              The all-in-one platform to manage projects, track progress, and collaborate with your team. 
              Turn your ideas into successful outcomes with powerful tools and intuitive design.
            </Text>
          </VStack>

          <HStack spacing={4} pt={4}>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg"
              colorScheme="brand"
              px={8}
              py={6}
              fontSize="lg"
            >
              Start Free Trial
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              variant="outline"
              px={8}
              py={6}
              fontSize="lg"
            >
              Sign In
            </Button>
          </HStack>

          <Text fontSize="sm" color={textColor} pt={4}>
            No credit card required • 14-day free trial
          </Text>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">Why Choose ProjectFlow?</Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Built for modern teams who need powerful project management without the complexity.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <Card key={index} bg={cardBg} shadow="md" borderRadius="xl">
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="brand.50"
                      color="brand.500"
                    >
                      <Icon as={feature.icon} boxSize={6} />
                    </Box>
                    <VStack spacing={2} align="start">
                      <Heading size="md">{feature.title}</Heading>
                      <Text color={textColor} fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="brand.500" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <VStack spacing={4} color="white">
              <Heading size="xl">Ready to Get Started?</Heading>
              <Text fontSize="lg" opacity={0.9} maxW="2xl">
                Join thousands of teams who are already using ProjectFlow to manage their projects more effectively.
              </Text>
            </VStack>

            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/signup"
                size="lg"
                bg="white"
                color="brand.500"
                _hover={{ bg: 'gray.50' }}
                px={8}
                py={6}
                fontSize="lg"
              >
                Create Account
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                px={8}
                py={6}
                fontSize="lg"
              >
                Sign In
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Text>&copy; 2024 ProjectFlow. All rights reserved.</Text>
            <HStack spacing={6}>
              <Text fontSize="sm" opacity={0.7}>
                Privacy Policy
              </Text>
              <Text fontSize="sm" opacity={0.7}>
                Terms of Service
              </Text>
              <Text fontSize="sm" opacity={0.7}>
                Support
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;
