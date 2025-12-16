#!/bin/bash
concurrently -n "Habits" \
 -c "green" \
 "pnpm --filter @lab/habits dev"