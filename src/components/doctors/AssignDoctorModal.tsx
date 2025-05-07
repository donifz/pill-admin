import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
} from '@chakra-ui/react';
import { doctorService } from '../../services/doctorService';
import { Doctor, DoctorCategory } from '../../types/doctor';

interface AssignDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export const AssignDoctorModal: React.FC<AssignDoctorModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}) => {
  const toast = useToast();
  const [categories, setCategories] = useState<DoctorCategory[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    yearsExperience: 0,
    photoUrl: '',
    bio: '',
    languages: [] as string[],
    consultationFee: 0,
    contactEmail: '',
    contactPhone: '',
    clinicAddress: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchDoctors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await doctorService.getCategories();
      setCategories(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later';
      toast({
        title: 'Error fetching categories',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getDoctors();
      setDoctors(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later';
      toast({
        title: 'Error fetching doctors',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      yearsExperience: doctor.yearsExperience,
      photoUrl: doctor.photoUrl || '',
      bio: doctor.bio,
      languages: doctor.languages,
      consultationFee: doctor.consultationFee,
      contactEmail: doctor.contactEmail,
      contactPhone: doctor.contactPhone,
      clinicAddress: doctor.clinicAddress,
      location: doctor.location,
      categoryId: doctor.category?.id || '',
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      if (selectedDoctor) {
        // If a doctor is selected, use their data to create a new doctor profile
        await doctorService.createDoctorFromUser(userId, {
          firstName: selectedDoctor.firstName,
          lastName: selectedDoctor.lastName,
          specialization: selectedDoctor.specialization,
          yearsExperience: selectedDoctor.yearsExperience,
          photoUrl: selectedDoctor.photoUrl || '',
          bio: selectedDoctor.bio,
          languages: selectedDoctor.languages,
          consultationFee: selectedDoctor.consultationFee,
          contactEmail: selectedDoctor.contactEmail,
          contactPhone: selectedDoctor.contactPhone,
          clinicAddress: selectedDoctor.clinicAddress,
          location: selectedDoctor.location,
          categoryId: formData.categoryId,
        });
      } else {
        // If no doctor is selected, create a new doctor from user
        await doctorService.createDoctorFromUser(userId, formData);
      }
      toast({
        title: 'Success',
        description: 'User has been assigned as a doctor',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to assign user as doctor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign User as Doctor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Select Existing Doctor</Tab>
              <Tab>Create New Doctor</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Select
                    placeholder="Select a doctor"
                    value={selectedDoctor?.id || ''}
                    onChange={(e) => {
                      const doctor = doctors.find(d => d.id === e.target.value);
                      if (doctor) handleDoctorSelect(doctor);
                    }}
                  >
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </Select>
                  {selectedDoctor && (
                    <Box p={4} borderWidth={1} borderRadius="md">
                      <Text fontWeight="bold">Selected Doctor Details:</Text>
                      <Text>Name: {selectedDoctor.firstName} {selectedDoctor.lastName}</Text>
                      <Text>Specialization: {selectedDoctor.specialization}</Text>
                      <Text>Category: {selectedDoctor.category?.name || 'No category assigned'}</Text>
                      <Text>Experience: {selectedDoctor.yearsExperience} years</Text>
                    </Box>
                  )}
                  {selectedDoctor && (
                    <FormControl isRequired>
                      <FormLabel>Category</FormLabel>
                      <Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Specialization</FormLabel>
                    <Input
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Years of Experience</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.yearsExperience}
                      onChange={(value) => handleNumberInputChange('yearsExperience', Number(value))}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Photo URL</FormLabel>
                    <Input
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Consultation Fee</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.consultationFee}
                      onChange={(value) => handleNumberInputChange('consultationFee', Number(value))}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact Email</FormLabel>
                    <Input
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact Phone</FormLabel>
                    <Input
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Clinic Address</FormLabel>
                    <Input
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Assign as Doctor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 