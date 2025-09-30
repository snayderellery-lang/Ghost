import Service from '@ember/service';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Service: whats-new', function () {
    setupTest();

    describe('hasNew', function () {
        it('returns false when no entries exist', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-01-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', []);

            expect(service.hasNew).to.be.false;
        });

        it('returns true when latest entry is newer than lastSeenDate', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-01-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', [{
                title: 'New Feature',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: false
            }]);

            expect(service.hasNew).to.be.true;
        });

        it('returns false when latest entry is older than lastSeenDate', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-12-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('_user', mockUser);
            service.set('entries', [{
                title: 'Old Feature',
                published_at: '2024-01-01T00:00:00.000Z',
                featured: false
            }]);

            expect(service.hasNew).to.be.false;
        });

        it('defaults to 2019-01-01 when no lastSeenDate exists', function () {
            const mockUser = {
                accessibility: '{}'
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', [{
                title: 'Recent Feature',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: false
            }]);

            expect(service.hasNew).to.be.true;
        });
    });

    describe('hasNewFeatured', function () {
        it('returns true when hasNew is true and latest entry is featured', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-01-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', [{
                title: 'Featured Update',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: true
            }]);

            expect(service.hasNewFeatured).to.be.true;
        });

        it('returns false when hasNew is false', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-12-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('_user', mockUser);
            service.set('entries', [{
                title: 'Old Featured Update',
                published_at: '2024-01-01T00:00:00.000Z',
                featured: true
            }]);

            expect(service.hasNewFeatured).to.be.false;
        });

        it('returns false when hasNew is true but entry is not featured', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    whatsNew: {
                        lastSeenDate: '2024-01-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', [{
                title: 'Non-featured Update',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: false
            }]);

            expect(service.hasNewFeatured).to.be.false;
        });

        it('returns false when entries array is empty', function () {
            const mockUser = {
                accessibility: '{}'
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            const service = this.owner.lookup('service:whats-new');
            service.set('entries', []);

            expect(service.hasNewFeatured).to.be.false;
        });
    });

    describe('shouldShowFeaturedBanner', function () {
        it('returns false when onboarding checklist is shown', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    onboarding: {
                        checklistState: 'started'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            this.owner.register('service:onboarding', Service.extend({
                isChecklistShown: true
            }));

            const service = this.owner.lookup('service:whats-new');
            service.set('_user', mockUser);
            service.set('entries', [{
                title: 'New Feature',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: true
            }]);

            expect(service.hasNewFeatured).to.be.true; // Would normally show
            expect(service.shouldShowFeaturedBanner).to.be.false; // But hidden during onboarding
        });

        it('returns true when onboarding checklist is not shown', function () {
            const mockUser = {
                accessibility: JSON.stringify({
                    onboarding: {
                        checklistState: 'completed'
                    },
                    whatsNew: {
                        lastSeenDate: '2024-01-01T00:00:00.000Z'
                    }
                })
            };

            this.owner.register('service:session', Service.extend({
                user: mockUser
            }));

            this.owner.register('service:store', Service.extend({}));

            this.owner.register('service:onboarding', Service.extend({
                isChecklistShown: false
            }));

            const service = this.owner.lookup('service:whats-new');
            service.set('_user', mockUser);
            service.set('entries', [{
                title: 'New Feature',
                published_at: '2024-12-01T00:00:00.000Z',
                featured: true
            }]);

            expect(service.hasNewFeatured).to.be.true;
            expect(service.shouldShowFeaturedBanner).to.be.true; // Shows after onboarding
        });
    });
});