import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../api/pm';
import TeamMemberDialog from './TeamMemberDialog';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const handleAddMember = async (formData) => {
    try {
      await addTeamMember(formData);
      await fetchTeamMembers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  const handleUpdateMember = async (formData) => {
    if (!selectedMember) return;
    try {
      await updateTeamMember(selectedMember.id, formData);
      await fetchTeamMembers();
      setIsDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to update team member:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteTeamMember(memberId);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const handleOpenDialog = (member) => {
    setSelectedMember(member || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Members</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{member.name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {member.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Role: {member.role}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {member.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(member)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMember(member.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TeamMemberDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={selectedMember ? handleUpdateMember : handleAddMember}
        member={selectedMember}
      />
    </Box>
  );
};

export default TeamMembers; 