package com.claudecode.hub.common.domain;

import com.claudecode.hub.common.exception.BizException;
import org.junit.jupiter.api.Test;

import static com.claudecode.hub.common.domain.ArticleStatus.*;
import static org.junit.jupiter.api.Assertions.*;

class ArticleStatusTest {

    @Test
    void legalTransitions() {
        // DRAFT → PENDING / PUBLISHED
        assertTrue(DRAFT.canTransitionTo(PENDING));
        assertTrue(DRAFT.canTransitionTo(PUBLISHED));
        // PENDING → DRAFT / PUBLISHED
        assertTrue(PENDING.canTransitionTo(DRAFT));
        assertTrue(PENDING.canTransitionTo(PUBLISHED));
        // PUBLISHED → DRAFT / OFFLINE
        assertTrue(PUBLISHED.canTransitionTo(DRAFT));
        assertTrue(PUBLISHED.canTransitionTo(OFFLINE));
        // OFFLINE → PUBLISHED / DRAFT
        assertTrue(OFFLINE.canTransitionTo(PUBLISHED));
        assertTrue(OFFLINE.canTransitionTo(DRAFT));
    }

    @Test
    void illegalTransitionsCoverAllOtherPairs() {
        // DRAFT → OFFLINE is illegal (must go via PUBLISHED)
        assertFalse(DRAFT.canTransitionTo(OFFLINE));
        // PENDING → OFFLINE is illegal
        assertFalse(PENDING.canTransitionTo(OFFLINE));
        // PUBLISHED → PENDING is illegal
        assertFalse(PUBLISHED.canTransitionTo(PENDING));
        // OFFLINE → PENDING is illegal
        assertFalse(OFFLINE.canTransitionTo(PENDING));
    }

    @Test
    void selfTransitionIsNeverAllowed() {
        for (ArticleStatus s : values()) {
            assertFalse(s.canTransitionTo(s), s + " → " + s + " must be rejected");
        }
    }

    @Test
    void nullTargetIsRejected() {
        for (ArticleStatus s : values()) {
            assertFalse(s.canTransitionTo(null));
        }
    }

    @Test
    void transitionToThrowsOnIllegal() {
        BizException ex = assertThrows(BizException.class, () -> DRAFT.transitionTo(OFFLINE));
        assertTrue(ex.getMessage().contains("DRAFT"));
        assertTrue(ex.getMessage().contains("OFFLINE"));
    }

    @Test
    void ofParsesBothCases() {
        assertEquals(DRAFT, ArticleStatus.of("draft"));
        assertEquals(DRAFT, ArticleStatus.of("DRAFT"));
        assertEquals(PUBLISHED, ArticleStatus.of("Published"));
        assertNull(ArticleStatus.of(null));
    }

    @Test
    void ofRejectsUnknown() {
        assertThrows(BizException.class, () -> ArticleStatus.of("ARCHIVED"));
    }
}
