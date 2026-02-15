import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Data } from '../../backend';

// Public queries removed - all record access is now admin-only
// Records can only be accessed through the Admin Panel using listAllAdmin()
