import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, overdueRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/overdue')
      ]);
      
      setProjects(projectsRes.data);
      setOverdueTasks(overdueRes.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/project/new');
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

  // Calculate overall statistics
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, project) => sum + project.totalTasks, 0);
  const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare chart data
  const statusData = [
    { name: 'Done', value: completedTasks, color: '#48BB78' },
    { name: 'In Progress', value: projects.reduce((sum, project) => sum + project.tasks.filter(task => task.status === 'In Progress').length, 0), color: '#ED8936' },
    { name: 'To Do', value: totalTasks - completedTasks - projects.reduce((sum, project) => sum + project.tasks.filter(task => task.status === 'In Progress').length, 0), color: '#E2E8F0' },
  ];

  const projectProgressData = projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    progress: project.completionPercentage,
  }));

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg" color="brand.500">
            Dashboard
          </Heading>
          <Button colorScheme="brand" onClick={handleCreateProject}>
            Create New Project
          </Button>
        </HStack>
        <Text color="gray.600">
          Welcome back! Here's an overview of your projects and tasks.
        </Text>
      </Box>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Projects</StatLabel>
                <StatNumber>{totalProjects}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Active projects
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Tasks</StatLabel>
                <StatNumber>{totalTasks}</StatNumber>
                <StatHelpText>
                  Across all projects
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Tasks</StatLabel>
                <StatNumber>{completedTasks}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {overallProgress}% completion rate
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Overdue Tasks</StatLabel>
                <StatNumber color={overdueTasks.length > 0 ? 'red.500' : 'green.500'}>
                  {overdueTasks.length}
                </StatNumber>
                <StatHelpText>
                  Need attention
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={8}>
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Task Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardHeader>
              <Heading size="md">Project Progress</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <Alert status="warning" mb={8}>
          <AlertIcon />
          You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} that need attention.
        </Alert>
      )}

      {/* Projects List */}
      <Box>
        <Heading size="md" mb={4}>
          Your Projects
        </Heading>
        {projects.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Text color="gray.500">No projects found. Create your first project to get started!</Text>
                <Button colorScheme="brand" onClick={handleCreateProject}>
                  Create Project
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {projects.map((project) => (
              <GridItem key={project._id}>
                <Card
                  as={RouterLink}
                  to={`/project/${project._id}`}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="sm" noOfLines={1}>
                        {project.name}
                      </Heading>
                      <Badge colorScheme={project.completionPercentage === 100 ? 'green' : 'blue'}>
                        {project.completionPercentage}%
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Text color="gray.600" mb={4} noOfLines={2}>
                      {project.description || 'No description'}
                    </Text>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Tasks: {project.totalTasks}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Completed: {project.completedTasks}
                        </Text>
                      </HStack>
                      <Progress
                        value={project.completionPercentage}
                        colorScheme={project.completionPercentage === 100 ? 'green' : 'brand'}
                        size="sm"
                      />
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
