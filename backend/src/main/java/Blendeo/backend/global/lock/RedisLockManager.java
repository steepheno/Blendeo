package Blendeo.backend.global.lock;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisLockManager {
    private final RedissonClient redissonClient;
    private static final long WAIT_TIME = 3L;
    private static final long LEASE_TIME = 2L;

    public boolean tryLock(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        try {
            return lock.tryLock(WAIT_TIME, LEASE_TIME, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    public void unlock(String lockKey) {
        RLock lock = redissonClient.getLock(lockKey);
        if (lock.isLocked() && lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }
}
