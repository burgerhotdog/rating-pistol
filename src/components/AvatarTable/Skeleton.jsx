import { TableBody, TableRow, TableCell, Skeleton, Stack } from "@mui/material";

const CustomSkeleton = () => {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="circular" width={24} height={24} />
          </TableCell>
          <TableCell>
            <Stack direction="row" display="inline-flex" spacing={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={120} height={36} />
            </Stack>
          </TableCell>
          <TableCell>
            <Skeleton variant="rounded" width={80} height={36} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={80} height={36} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rounded" width={60} height={36} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" width={24} height={24} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
};

export default CustomSkeleton;
