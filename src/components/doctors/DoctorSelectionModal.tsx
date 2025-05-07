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
  VStack,
  HStack,
  Text,
  Input,
  Select,
  useToast,
  Box,
  Image,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { doctorService } from '../../services/doctorService';
import { Doctor, DoctorCategory } from '../../types/doctor';

interface DoctorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (doctor: Doctor) => void;
}

export const DoctorSelectionModal: React.FC<DoctorSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const toast = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<DoctorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsData, categoriesData] = await Promise.all([
        doctorService.getDoctors(),
        doctorService.getCategories(),
      ]);
      setDoctors(doctorsData);
      setCategories(categoriesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || doctor.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (doctor: Doctor) => {
    onSelect(doctor);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select a Doctor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack>
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                placeholder="All Categories"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                width="200px"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </HStack>

            {loading ? (
              <Box textAlign="center" py={4}>
                <Spinner size="xl" />
              </Box>
            ) : filteredDoctors.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Text color="gray.500">No doctors found</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
                {filteredDoctors.map((doctor) => (
                  <Box
                    key={doctor.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => handleSelect(doctor)}
                  >
                    <HStack spacing={4}>
                      <Image
                        src={doctor.photoUrl || '/default-doctor.png'}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        boxSize="60px"
                        borderRadius="full"
                        objectFit="cover"
                      />
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold">
                          {doctor.firstName} {doctor.lastName}
                        </Text>
                        <Text color="gray.600">{doctor.specialization}</Text>
                        <HStack>
                          <Badge colorScheme="blue">
                            {doctor.category?.name}
                          </Badge>
                          <Badge colorScheme="green">
                            {doctor.yearsExperience} years exp.
                          </Badge>
                          <Badge colorScheme="purple">
                            ${doctor.consultationFee}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 