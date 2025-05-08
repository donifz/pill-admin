import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  Heading,
  Badge,
  VStack,
  HStack,
  Divider,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useBreakpointValue,
  Flex,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLanguage, FaClock, FaArrowLeft } from 'react-icons/fa';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types/doctor';

const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Responsive values
  const gridTemplateColumns = useBreakpointValue({
    base: '1fr',
    md: '300px 1fr',
    lg: '350px 1fr',
  });

  const imageHeight = useBreakpointValue({
    base: '200px',
    md: '300px',
    lg: '350px',
  });

  const containerPadding = useBreakpointValue({
    base: 4,
    md: 6,
    lg: 8,
  });

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const doctorData = await doctorService.getDoctor(id!);
      setDoctor(doctorData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch doctor details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={containerPadding} display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text fontSize="xl">Loading...</Text>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box p={containerPadding} display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Text fontSize="xl">Doctor not found</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={containerPadding}>
      <Button
        mb={6}
        onClick={() => navigate('/admin/doctors')}
        leftIcon={<Icon as={FaArrowLeft} />}
        variant="outline"
        _hover={{ bg: 'gray.100' }}
      >
        Back to Doctors
      </Button>

      <Grid templateColumns={gridTemplateColumns} gap={8}>
        {/* Doctor Profile Section */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Card overflow="hidden" borderRadius="lg" boxShadow="md">
              <Image
                src={doctor.photoUrl || '/default-doctor.png'}
                alt={`${doctor.firstName} ${doctor.lastName}`}
                objectFit="cover"
                w="full"
                h={imageHeight}
              />
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="lg">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </Heading>
                  <Badge colorScheme="blue" alignSelf="start" px={3} py={1} borderRadius="full">
                    {doctor.category?.name}
                  </Badge>
                  <Text color="gray.600" fontSize="lg">{doctor.specialization}</Text>
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel>Experience</StatLabel>
                      <StatNumber>{doctor.yearsExperience} years</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Fee</StatLabel>
                      <StatNumber>${doctor.consultationFee}</StatNumber>
                    </Stat>
                  </SimpleGrid>

                  <Divider />

                  <Stat>
                    <StatLabel>Rating</StatLabel>
                    <HStack>
                      <StatNumber>{doctor.rating || 'N/A'}</StatNumber>
                      <Icon as={FaStar} color="yellow.400" />
                    </HStack>
                    <StatHelpText>
                      <StatArrow type={doctor.rating && doctor.rating >= 4 ? 'increase' : 'decrease'} />
                      {doctor.reviewsCount || 0} reviews
                    </StatHelpText>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Contact Card */}
            <Card borderRadius="lg" boxShadow="md">
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Quick Contact</Heading>
                  <HStack>
                    <Icon as={FaPhone} color="blue.500" />
                    <Text>{doctor.contactPhone}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaEnvelope} color="blue.500" />
                    <Text>{doctor.contactEmail}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="blue.500" />
                    <Text>{doctor.clinicAddress}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Doctor Details Section */}
        <GridItem>
          <Card borderRadius="lg" boxShadow="md">
            <CardBody>
              <Tabs variant="enclosed" colorScheme="blue">
                <TabList>
                  <Tab>Profile</Tab>
                  <Tab>Contact</Tab>
                  <Tab>Patients</Tab>
                  <Tab>Reviews</Tab>
                </TabList>

                <TabPanels>
                  {/* Profile Tab */}
                  <TabPanel>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" mb={3}>Bio</Heading>
                        <Text fontSize="md" lineHeight="tall">{doctor.bio}</Text>
                      </Box>
                      
                      <Box>
                        <Heading size="md" mb={3}>Languages</Heading>
                        <HStack wrap="wrap" spacing={2}>
                          {doctor.languages.map((language, index) => (
                            <Badge key={index} colorScheme="teal" px={3} py={1} borderRadius="full">
                              <HStack spacing={1}>
                                <Icon as={FaLanguage} />
                                <Text>{language}</Text>
                              </HStack>
                            </Badge>
                          ))}
                        </HStack>
                      </Box>

                      <Box>
                        <Heading size="md" mb={3}>Available Slots</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                          {doctor.availableSlots.map((slot, index) => (
                            <Tooltip key={index} label={new Date(slot).toLocaleString()}>
                              <Badge colorScheme="blue" p={2} borderRadius="md">
                                <HStack spacing={1}>
                                  <Icon as={FaClock} />
                                  <Text>{new Date(slot).toLocaleDateString()}</Text>
                                </HStack>
                              </Badge>
                            </Tooltip>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* Contact Tab */}
                  <TabPanel>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" mb={3}>Contact Information</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <HStack>
                            <Icon as={FaEnvelope} color="blue.500" boxSize={5} />
                            <Text>{doctor.contactEmail}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaPhone} color="blue.500" boxSize={5} />
                            <Text>{doctor.contactPhone}</Text>
                          </HStack>
                        </SimpleGrid>
                      </Box>

                      <Box>
                        <Heading size="md" mb={3}>Clinic Address</Heading>
                        <HStack>
                          <Icon as={FaMapMarkerAlt} color="blue.500" boxSize={5} />
                          <Text>{doctor.clinicAddress}</Text>
                        </HStack>
                      </Box>

                      <Box>
                        <Heading size="md" mb={3}>Location</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Text>Latitude: {doctor.location.latitude}</Text>
                          <Text>Longitude: {doctor.location.longitude}</Text>
                        </SimpleGrid>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* Patients Tab */}
                  <TabPanel>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Patient Name</Th>
                          <Th>Email</Th>
                          <Th>Phone</Th>
                          <Th>Last Visit</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td colSpan={4} textAlign="center">
                            No patients assigned yet
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TabPanel>

                  {/* Reviews Tab */}
                  <TabPanel>
                    <VStack align="stretch" spacing={4}>
                      <Text textAlign="center">No reviews yet</Text>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DoctorDetailsPage; 