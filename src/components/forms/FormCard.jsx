// components/forms/FormCard.jsx
import { Card, CardContent } from '@mui/material';

export const FormCard = ({ children, sx = {} }) => (
  <Card sx={{ mb: 3, ...sx }}>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);