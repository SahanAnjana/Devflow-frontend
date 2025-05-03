import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// PM Pages
import PMDashboard from '../pages/pm/PMDashboard';
import Projects from '../pages/pm/Projects';
import Tasks from '../pages/pm/Tasks';
import Team from '../pages/pm/Team';
import Issues from '../pages/pm/Issues';
import Timeline from '../pages/pm/Timeline';
import Resources from '../pages/pm/Resources';

const pmRoutes = [
  {
    path: '/pm',
    element: (
      <ProtectedRoute>
        <PMDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/projects',
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/tasks',
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/team',
    element: (
      <ProtectedRoute>
        <Team />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/issues',
    element: (
      <ProtectedRoute>
        <Issues />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/timeline',
    element: (
      <ProtectedRoute>
        <Timeline />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pm/resources',
    element: (
      <ProtectedRoute>
        <Resources />
      </ProtectedRoute>
    ),
  },
];

export default pmRoutes; 