import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {find, render} from '@ember/test-helpers';
import {setupRenderingTest} from 'ember-mocha';

describe('Integration: Component: gh-nav-menu/footer-banner', function () {
    setupRenderingTest();

    it('shows what\'s new banner when hasNewFeatured is true and referral invite is not showing', async function () {
        this.owner.register('service:whatsNew', Service.extend({
            hasNew: true,
            hasNewFeatured: true,
            shouldShowFeaturedBanner: true,
            seen() {},
            init() {
                this._super(...arguments);
                this.entries = [{
                    title: 'Test Feature',
                    url: 'https://ghost.org/changelog/test',
                    custom_excerpt: 'Test description',
                    published_at: '2024-12-01T00:00:00.000Z',
                    featured: true
                }];
            }
        }));

        this.owner.register('service:session', Service.extend({
            init() {
                this._super(...arguments);
                this.user = {
                    isAdmin: false
                };
            }
        }));

        this.owner.register('service:dashboardStats', Service.extend({
            currentMRR: 0,
            loadMrrStats() {
                return Promise.resolve();
            }
        }));

        this.owner.register('service:feature', Service.extend({
            init() {
                this._super(...arguments);
                this.accessibility = {
                    referralInviteDismissed: false
                };
            }
        }));

        this.owner.register('service:membersUtils', Service.extend({
            isStripeEnabled: false
        }));

        this.owner.register('service:modals', Service.extend({}));
        this.owner.register('service:settings', Service.extend({
            stripeConnectLivemode: false
        }));

        await render(hbs`<GhNavMenu::FooterBanner />`);

        expect(find('.gh-whatsnew-toast'), 'what\'s new banner is visible').to.exist;
        expect(find('.gh-sidebar-banner-subhead'), 'subhead element exists').to.exist;
        expect(find('.gh-sidebar-banner-subhead').textContent).to.match(/What.s new\?/);
        expect(find('.gh-sidebar-banner-msg')).to.contain.text('Test Feature');
        expect(find('.gh-sidebar-banner-details')).to.contain.text('Test description');
    });

    it('hides what\'s new banner when hasNewFeatured is false', async function () {
        this.owner.register('service:whatsNew', Service.extend({
            hasNew: true,
            hasNewFeatured: false,
            seen() {},
            init() {
                this._super(...arguments);
                this.entries = [{
                    title: 'Non-featured Update',
                    url: 'https://ghost.org/changelog/test',
                    published_at: '2024-12-01T00:00:00.000Z',
                    featured: false
                }];
            }
        }));

        this.owner.register('service:session', Service.extend({
            init() {
                this._super(...arguments);
                this.user = {
                    isAdmin: false
                };
            }
        }));

        this.owner.register('service:dashboardStats', Service.extend({
            currentMRR: 0,
            loadMrrStats() {
                return Promise.resolve();
            }
        }));

        this.owner.register('service:feature', Service.extend({
            init() {
                this._super(...arguments);
                this.accessibility = {
                    referralInviteDismissed: false
                };
            }
        }));

        this.owner.register('service:membersUtils', Service.extend({
            isStripeEnabled: false
        }));

        this.owner.register('service:modals', Service.extend({}));
        this.owner.register('service:settings', Service.extend({
            stripeConnectLivemode: false
        }));

        await render(hbs`<GhNavMenu::FooterBanner />`);

        expect(find('.gh-whatsnew-toast'), 'what\'s new banner is hidden').to.not.exist;
    });

    it('hides what\'s new banner when referral invite is showing (priority)', async function () {
        this.owner.register('service:whatsNew', Service.extend({
            hasNew: true,
            hasNewFeatured: true,
            shouldShowFeaturedBanner: true,
            seen() {},
            init() {
                this._super(...arguments);
                this.entries = [{
                    title: 'Test Feature',
                    url: 'https://ghost.org/changelog/test',
                    custom_excerpt: 'Test description',
                    published_at: '2024-12-01T00:00:00.000Z',
                    featured: true
                }];
            }
        }));

        this.owner.register('service:session', Service.extend({
            init() {
                this._super(...arguments);
                this.user = {
                    isAdmin: true
                };
            }
        }));

        this.owner.register('service:dashboardStats', Service.extend({
            currentMRR: 10100, // $101 MRR
            loadMrrStats() {
                return Promise.resolve();
            }
        }));

        this.owner.register('service:feature', Service.extend({
            init() {
                this._super(...arguments);
                this.accessibility = {
                    referralInviteDismissed: false
                };
            }
        }));

        this.owner.register('service:membersUtils', Service.extend({
            isStripeEnabled: true
        }));

        this.owner.register('service:modals', Service.extend({}));
        this.owner.register('service:settings', Service.extend({
            stripeConnectLivemode: true
        }));

        this.set('hasThemeErrors', false);

        await render(hbs`<GhNavMenu::FooterBanner @hasThemeErrors={{this.hasThemeErrors}} />`);

        expect(find('.gh-referral-toast'), 'referral banner is visible').to.exist;
        expect(find('.gh-whatsnew-toast'), 'what\'s new banner is hidden').to.not.exist;
    });

    it('hides what\'s new banner when hasNew is false', async function () {
        this.owner.register('service:whatsNew', Service.extend({
            hasNew: false,
            hasNewFeatured: false,
            seen() {},
            init() {
                this._super(...arguments);
                this.entries = [];
            }
        }));

        this.owner.register('service:session', Service.extend({
            init() {
                this._super(...arguments);
                this.user = {
                    isAdmin: false
                };
            }
        }));

        this.owner.register('service:dashboardStats', Service.extend({
            currentMRR: 0,
            loadMrrStats() {
                return Promise.resolve();
            }
        }));

        this.owner.register('service:feature', Service.extend({
            init() {
                this._super(...arguments);
                this.accessibility = {
                    referralInviteDismissed: false
                };
            }
        }));

        this.owner.register('service:membersUtils', Service.extend({
            isStripeEnabled: false
        }));

        this.owner.register('service:modals', Service.extend({}));
        this.owner.register('service:settings', Service.extend({
            stripeConnectLivemode: false
        }));

        await render(hbs`<GhNavMenu::FooterBanner />`);

        expect(find('.gh-whatsnew-toast'), 'what\'s new banner is hidden').to.not.exist;
    });

    it('uses shouldShowFeaturedBanner from whatsNew service', async function () {
        this.owner.register('service:whatsNew', Service.extend({
            hasNew: true,
            hasNewFeatured: true,
            shouldShowFeaturedBanner: false, // Override to false
            seen() {},
            init() {
                this._super(...arguments);
                this.entries = [{
                    title: 'Test Feature',
                    url: 'https://ghost.org/changelog/test',
                    custom_excerpt: 'Test description',
                    published_at: '2024-12-01T00:00:00.000Z',
                    featured: true
                }];
            }
        }));

        this.owner.register('service:session', Service.extend({
            init() {
                this._super(...arguments);
                this.user = {
                    isAdmin: false
                };
            }
        }));

        this.owner.register('service:dashboardStats', Service.extend({
            currentMRR: 0,
            loadMrrStats() {
                return Promise.resolve();
            }
        }));

        this.owner.register('service:feature', Service.extend({
            init() {
                this._super(...arguments);
                this.accessibility = {
                    referralInviteDismissed: false
                };
            }
        }));

        this.owner.register('service:membersUtils', Service.extend({
            isStripeEnabled: false
        }));

        this.owner.register('service:modals', Service.extend({}));
        this.owner.register('service:settings', Service.extend({
            stripeConnectLivemode: false
        }));

        await render(hbs`<GhNavMenu::FooterBanner />`);

        // Should NOT show banner because shouldShowFeaturedBanner=false
        expect(find('.gh-whatsnew-toast'), 'what\'s new banner respects shouldShowFeaturedBanner').to.not.exist;
    });
});