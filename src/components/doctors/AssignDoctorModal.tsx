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
  Box,
  Text,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { doctorService } from '../../services/doctorService';
import { DoctorCategory } from '../../types/doctor';

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
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [languageInput, setLanguageInput] = useState('');
  const [formData, setFormData] = useState({
    specialization: '',
    yearsExperience: 0,
    photoUrl: '',
    bio: '',
    languages: [] as string[],
    consultationFee: 0,
    contactPhone: '',
    clinicAddress: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    categoryId: '',
    availableSlots: [] as Date[],
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchCategories();
      fetchUserData();
    }
  }, [isOpen, userId]);

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

  const fetchUserData = async () => {
    try {
      const response = await doctorService.getUserDataForDoctor(userId);
      setUserData(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later';
      toast({
        title: 'Error fetching user data',
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

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      setFormData((prev) => ({ ...prev, languages: [...prev.languages, languageInput.trim()] }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      await doctorService.createDoctorFromUser(userId, {
        ...formData,
        languages: formData.languages || [],
        ...(formData.availableSlots.length > 0 && {
          availableSlots: formData.availableSlots.map(slot => slot instanceof Date ? slot : new Date(slot))
        }),
        userId: userId,
      });

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
          <VStack spacing={6} align="stretch">
            {/* User Information Display */}
            {userData && (
              <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <Text fontWeight="bold" mb={2}>User Information (Auto-filled)</Text>
                <HStack spacing={4} wrap="wrap">
                  <Badge colorScheme="blue">Name: {userData.firstName} {userData.lastName}</Badge>
                  <Badge colorScheme="green">Email: {userData.contactEmail}</Badge>
                  {userData.city && <Badge colorScheme="purple">City: {userData.city}</Badge>}
                </HStack>
              </Box>
            )}

            {/* Doctor-Specific Form */}
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  placeholder="Select category"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Specialization</FormLabel>
                <Input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiology, Pediatrics"
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

              <FormControl>
                <FormLabel>Photo URL</FormLabel>
                <Input
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your medical background and expertise..."
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Languages Spoken</FormLabel>
                <HStack>
                  <Input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Add language"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                  />
                  <Button size="sm" onClick={handleAddLanguage}>Add</Button>
                </HStack>
                <HStack mt={2} wrap="wrap">
                  {formData.languages.map((lang) => (
                    <Badge key={lang} colorScheme="teal" p={2}>
                      {lang}
                      <Button
                        size="xs"
                        ml={2}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveLanguage(lang)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Consultation Fee ($)</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.consultationFee}
                  onChange={(value) => handleNumberInputChange('consultationFee', Number(value))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Clinic Address</FormLabel>
                <Input
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  placeholder="123 Medical Center Dr, Suite 100"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location - Latitude</FormLabel>
                <NumberInput
                  value={formData.location.latitude}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, latitude: Number(value) }
                  }))}
                  step="any"
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location - Longitude</FormLabel>
                <NumberInput
                  value={formData.location.longitude}
                  onChange={(value) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, longitude: Number(value) }
                  }))}
                  step="any"
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </VStack>
          </VStack>
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