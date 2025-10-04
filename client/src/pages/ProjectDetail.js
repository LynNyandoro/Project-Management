import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Badge,
  Progress,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Grid,
} from '@chakra-ui/react';
import { ArrowBackIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const { isOpen: isTaskModalOpen, onOpen: onTaskModalOpen, onClose: onTaskModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
  });

  const fetchProjectData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      setError('Failed to fetch project data');
      console.error('Project detail error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProjectData();
    } else if (id === 'new') {
      // Handle new project case
      setLoading(false);
      setProject(null);
      setTasks([]);
    }
  }, [id, fetchProjectData]);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', projectForm);
      // Navigate to the newly created project
      navigate(`/project/${res.data._id}`);
    } catch (error) {
      setError('Failed to create project');
      console.error('Project creation error:', error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/projects/${id}/tasks/${editingTask._id}`, taskForm);
        setTasks(tasks.map(task => 
          task._id === editingTask._id 
            ? { ...task, ...taskForm, dueDate: new Date(taskForm.dueDate) }
            : task
        ));
        setEditingTask(null);
        onEditModalClose();
      } else {
        const res = await api.post(`/projects/${id}/tasks`, taskForm);
        setTasks([res.data, ...tasks]);
        onTaskModalClose();
      }
      setTaskForm({ title: '', description: '', dueDate: '', status: 'To Do' });
    } catch (error) {
      console.error('Task submit error:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/projects/${id}/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Delete task error:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      status: task.status,
    });
    onEditModalOpen();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/projects/${id}/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Status change error:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'green';
      case 'In Progress': return 'orange';
      case 'To Do': return 'gray';
      default: return 'gray';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'Done';
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  // Show project creation form for new projects
  if (id === 'new') {
    return (
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <HStack mb={4}>
            <Button as={RouterLink} to="/dashboard" leftIcon={<ArrowBackIcon />} variant="ghost">
              Back to Dashboard
            </Button>
          </HStack>
          <Heading size="lg" color="brand.500">
            Create New Project
          </Heading>
          <Text color="gray.600" mt={2}>
            Create a new project to start organizing your tasks.
          </Text>
        </Box>

        <Card>
          <CardHeader>
            <Heading size="md">Project Details</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleProjectSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Project Name</FormLabel>
                  <Input
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={4}
                  />
                </FormControl>
                <HStack w="full" justify="flex-end">
                  <Button as={RouterLink} to="/dashboard" variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="brand">
                    Create Project
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Project not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <HStack mb={8}>
        <IconButton
          as={RouterLink}
          to="/dashboard"
          icon={<ArrowBackIcon />}
          variant="ghost"
          aria-label="Back to dashboard"
        />
        <Box>
          <Heading size="lg" color="brand.500">
            {project.name}
          </Heading>
          <Text color="gray.600">
            {project.description || 'No description'}
          </Text>
        </Box>
      </HStack>

      {/* Project Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.500">Total Tasks</Text>
              <Text fontSize="2xl" fontWeight="bold">{tasks.length}</Text>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.500">Completed</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {tasks.filter(task => task.status === 'Done').length}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <VStack align="stretch">
              <Text fontSize="sm" color="gray.500">Progress</Text>
              <Progress 
                value={project.completionPercentage} 
                colorScheme="brand" 
                size="lg"
              />
              <Text fontSize="sm" fontWeight="bold">
                {project.completionPercentage}%
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Task Management */}
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Tasks</Heading>
            <HStack>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                w="150px"
              >
                <option value="all">All Tasks</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Select>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={onTaskModalOpen}
              >
                Add Task
              </Button>
            </HStack>
          </Flex>
        </CardHeader>
        <CardBody>
          {filteredTasks.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No tasks found. Create your first task to get started!
            </Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {filteredTasks.map((task) => (
                <Card key={task._id} variant="outline">
                  <CardBody>
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack>
                          <Heading size="sm">{task.title}</Heading>
                          <Badge colorScheme={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          {isOverdue(task.dueDate, task.status) && (
                            <Badge colorScheme="red">Overdue</Badge>
                          )}
                        </HStack>
                        {task.description && (
                          <Text color="gray.600" fontSize="sm">
                            {task.description}
                          </Text>
                        )}
                        <Text fontSize="sm" color="gray.500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                      </VStack>
                      <HStack>
                        <Select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          size="sm"
                          w="120px"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </Select>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem onClick={() => handleEditTask(task)}>
                              Edit Task
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDeleteTask(task._id)}
                              color="red.500"
                            >
                              Delete Task
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={onTaskModalClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleTaskSubmit}>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Task Title</FormLabel>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Enter task description"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onTaskModalClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="brand">
                Add Task
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleTaskSubmit}>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Task Title</FormLabel>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Enter task description"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditModalClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="brand">
                Update Task
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProjectDetail;
